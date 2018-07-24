const proxy = require('express-http-proxy');
const url = require('url');

//
// Some glitch.com urls are served by other sites.
// This simple proxy lets us match them and send them along.
// If this file gets too big, it should be split into a separate app.
//

module.exports = function(app) {
    // Proxy the some parts of our site over to ghost blogs:
  proxyGhost(app, 'help', 'help-center.glitch.me');
  proxyGhost(app, 'featured', 'featured.glitch.me');
}

function proxyGhost(app, route, glitchTarget) {
  const routeWithLeadingSlash = `/${route}`;
  const sandwichedRoute = `/${route}/`;
  // node matches /{route} and /{route}/;
  // we need to force /{route}/ so that relative links in Ghost work. 
  app.all(routeWithLeadingSlash, (req, res, next) => {
      const path = req.path;
      if(!path.toLowerCase().startsWith(sandwichedRoute)) {
         //therefore, path is "/{route}[^/]"/i
         const rest = path.substring(sandwichedRoute.length - 1);
         return res.redirect(301, sandwichedRoute + rest);
      }
      return next();
  });

  // Proxy all the requests to /{route}/ over to to glitchTarget:
  app.use(sandwichedRoute, proxy(glitchTarget, {
    preserveHostHdr: false, // glitch routes based on this, so we have to reset it
    https: false, // allows the proxy to do less work
    proxyReqPathResolver: function(req) {
      const path = routeWithLeadingSlash + url.parse(req.url).path;
      console.log("Proxied:", path);
      return path;
    }
  }));
}
