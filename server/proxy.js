const proxy = require('express-http-proxy');
const url = require('url');

//
// Some glitch.com urls are served by other sites.
// This simple proxy lets us match them and send them along.
// If this file gets too big, it should be split into a separate app.
//

module.exports = function(app) {
  const routes = [];
  
  function proxyGlitch(route, target, pathOnTarget="") {
    const routeWithLeadingSlash = `/${route}`;
    app.use(routeWithLeadingSlash, proxy(target, {
      preserveHostHdr: false, // glitch routes based on this, so we have to reset it
      https: false, // allows the proxy to do less work
      proxyReqPathResolver: (req) => {
        const path = pathOnTarget + routeWithLeadingSlash + url.parse(req.url).path;
        console.log("Proxied:", path);
        return path;
      }
    }));
    routes.push(routeWithLeadingSlash);
  }

  function proxyGhost(route, glitchTarget, pathOnTarget) {
    const routeWithLeadingSlash = `/${route}`;
    const sandwichedRoute = `/${route}/`;
    // node matches /{route} and /{route}/;
    // we need to force /{route}/ so that relative links in Ghost work. 
    app.all(routeWithLeadingSlash, (req, res, next) => {
        const path = req.path;
        if(!path.toLowerCase().startsWith(sandwichedRoute)) {
           //therefore, path is "/{route}[^/]"/i
           const rest = path.substring(sandwichedRoute.length);
           return res.redirect(301, sandwichedRoute + rest);
        }
        return next();
    });

    // Proxy all the requests to /{route}/ over to glitchTarget
    proxyGlitch(route, glitchTarget, pathOnTarget);
  }

  // Proxy the some parts of our site over to ghost blogs:
  proxyGhost(app, 'help', 'help-center.glitch.me');
  proxyGhost(app, 'featured', 'featured.glitch.me');
  
  // pending legal change -- case 3323312
  // proxyGhost(app, 'about', 'about-glitch.glitch.me',);
  // proxyGhost(app, 'legal', 'about-glitch.glitch.me', '/about');
  // ..and then also remove these two special lines:
  proxyGlitch(app, 'about', 'about.glitch.me');
  proxyGlitch(app, 'legal', 'about.glitch.me');
  // End special considerations.
  
  // Pages hosted by 'about.glitch.me':
  [
    'faq',
    'react-starter-kit',
    'website-starter-kit',
    'forteams',
    'forplatforms',
    'you-got-this',
    'email-sales',
  ].forEach((route) => proxyGlitch(route, 'about.glitch.me'));
  
  return routes;
}