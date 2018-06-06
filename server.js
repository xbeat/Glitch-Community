const express = require("express");
const compression = require("compression");
const proxy = require('express-http-proxy');
const url = require('url');

require("./webpack.config.js"); // So that webpack lints itself

const app = express();

// Accept JSON as req.body
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());

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

app.use('/help/', proxy('help-center.glitch.me', {
  preserveHostHdr: false, // glitch routes based on this, so we have to reset it
  https: false, // allows the proxy to do less work
  proxyReqPathResolver: function(req) {
    const path = '/help' + url.parse(req.url).path;
    console.log("Proxied:", path);
    return path;
  }
}));

const router = require('./routes')();
app.use('/', router);

// Add an explicit no-cache to 404 responses
// Since this is the last handler it will only be hit when all other handlers miss
app.use(function(req, res, next) {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  return next();
});

// Listen on App port
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}.`);
});
