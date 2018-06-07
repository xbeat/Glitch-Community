const proxy = require('express-http-proxy');
const url = require('url');

//
// Some glitch.com urls are served by other sites.
// This simple proxy lets us match them and send them along.
// If this file gets too big, it should be split into a separate app.
//

module.exports = function(app) {
  // Proxy the /help/ section of our site over to help-center,
  // which is a Ghost blog.

  // node matches /help and /help/;
  // we need to force /help/ so that relative links in Ghost work. 
  app.all('/help', (req, res, next) => {
      const path = req.path;
      if(!path.toLowerCase().startsWith("/help/")) {
         //therefore, path is "/help[^/]"/i
         const rest = path.substring(5);
         return res.redirect(301, "/help/" + rest);
      }
      return next();
  });

  // Proxy all the requests to /help/ over to help-center:
  app.use('/help/', proxy('help-center.glitch.me', {
    preserveHostHdr: false, // glitch routes based on this, so we have to reset it
    https: false, // allows the proxy to do less work
    proxyReqPathResolver: function(req) {
      const path = '/help' + url.parse(req.url).path;
      console.log("Proxied:", path);
      return path;
    }
  }));
}
