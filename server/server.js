const express = require("express");
const compression = require("compression");

// https://docs.sentry.io/clients/node/
const Sentry = require("@sentry/node");
Raven.config({
  dsn: 'https://4f1a68242b6944738df12eecc34d377c@sentry.io/1246508',
  name: process.env.PROJECT_DOMAIN,
  extra: {
    project_domain: process.env.PROJECT_DOMAIN,
    node_env: process.env.NODE_ENV,
  },
}).install();
Sentry.configureScope(scope => {
});

const app = express();

// Accept JSON as req.body
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());

const redirects = require('./redirects');
redirects(app);

const proxy = require('./proxy');
const proxied = proxy(app);

const router = require('./routes');
app.use('/', router(['/edit', ...proxied]));

// Add an explicit no-cache to 404 responses
// Since this is the last handler it will only be hit when all other handlers miss
app.use(function(req, res, next) {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  return next();
});

// Listen on App port
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}.`);
});
