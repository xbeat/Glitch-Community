const proxy = require('express-http-proxy');
const url = require('url');
const urlJoin = require('url-join');

//
// Some glitch.com urls are served by other sites.
// This simple proxy lets us match them and send them along.
// If this file gets too big, it should be split into a separate app.
//

module.exports = function(app) {
  const routes = [];
  
  function proxyGlitch(route, target, pathOnTarget="") {
    const routeWithLeadingSlash = urlJoin("/", route);
    const sandwichedRoute = urlJoin("/", route, "/");
    
    // node matches /{route} and /{route}/;
    // we need to force /{route}/ so that relative links in Ghost work. 
    app.all(routeWithLeadingSlash, (req, res, next) => {
        const path = req.path;
        if(!path.toLowerCase().startsWith(sandwichedRoute.toLowerCase())) {
           //therefore, path is "/{route}[^/]"/i
           const rest = path.substring(sandwichedRoute.length);
           return res.redirect(301, sandwichedRoute + rest);
        }
        return next();
    });
    
    // Do the actual proxy
    app.use(routeWithLeadingSlash, proxy(target, {
      preserveHostHdr: false, // glitch routes based on this, so we have to reset it
      https: true,
      proxyReqPathResolver: (req) => {
        const path = urlJoin("/", pathOnTarget, url.parse(req.url).path);
        console.log("Proxied:", path);
        return path;
      }
    }));
    
    routes.push(routeWithLeadingSlash);
  }

  function proxyGhost(route, glitchTarget, pathOnTarget='') {
    // Proxy all the requests to /{route}/ over to glitchTarget
    proxyGlitch(route, glitchTarget, urlJoin(pathOnTarget, route));
  }

  // Proxy the some parts of our site over to ghost blogs:
  proxyGhost('help', 'help-center.glitch.me');
  proxyGhost('featured', 'featured.glitch.me');
  proxyGhost('about', 'about-glitch.glitch.me');
  proxyGhost('legal', 'about-glitch.glitch.me', '/about');
  
  // Pages hosted by 'about.glitch.me':
  [
    'forplatforms',
    'email-sales',
  ].forEach((route) => proxyGlitch(route, 'about.glitch.me', route));
  
  proxyGlitch('teams', 'teams.glitch.me');
  
  return routes;
}
