const express = require('express');
const fs = require('fs');
const util = require('util');
const moment = require('moment-mini');

const {getProject, getTeam, getUser, getZine} = require('./api');
const constants = require('./constants');

module.exports = function(external) {

  const app = express.Router();

  // CORS - Allow pages from any domain to make requests to our API
  app.use(function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    return next();
  });

  // Caching - js and CSS files have a hash in their name, so they last a long time
  ['/*.js', '/*.css'].forEach((path) => (
    app.use(path, (request, response, next) => {
      const s = moment.duration(1, 'months').asSeconds();
      response.header('Cache-Control', `public, max-age=${s}`);
      return next();
    })
  ));
  
  if (process.env.NODE_ENV !== 'production') {
    compiler.watch({}, (error, stats) => {
      if (error) {
        console.error(error);
      } else {
        console.log(stats.toString({chunks: false}));
      }
    });
  } else {
  const webpack = require('webpack');
  const webpackConfig = require('../webpack.config.js');
  const compiler = webpack(webpackConfig);
    const webpackMiddleware = require('webpack-dev-middleware');
    const middleware = webpackMiddleware(compiler, {
      writeToDisk: true,
    });
    let ready = false;
    middleware.waitUntilValid(() => {
      ready = true;
    });
    app.use(function(request, response, next) {
      if (ready) {
        return middleware(request, response, next);
      }
      return next();
    });
  }

  app.use(express.static('public', { index: false }));

  // Log all requests for diagnostics
  app.use(function(request, response, next) {
    console.log(request.method, request.originalUrl, request.body);
    return next();
  });

  const readFilePromise = util.promisify(fs.readFile);
  const imageDefault = 'https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fsocial-card%402x.png';
  async function render(res, title, description, image=imageDefault) {
    let built = true;
    
    const zine = await getZine() || [];
    let scripts = [];
    let styles = [];
    
    try {
      const stats = JSON.parse(await readFilePromise('public/stats.json'));
      stats.chunks.forEach(chunk => {
        if (chunk.initial) {
          chunk.files.forEach(file => {
            if (file.endsWith('.js') && !chunk.names.includes('styles')) {
              scripts.push(`/${file}?${chunk.hash}`);
            } else if (file.endsWith('.css')) {
              styles.push(`/${file}?${chunk.hash}`);
            }
          });
        }
      });
    } catch (error) {
      console.error("Failed to load webpack stats file. Unless you see a webpack error here, the initial build probably just isn't ready yet.");
      built = false;
    }
    
    res.render('index.ejs', {
      title, description, image,
      scripts, styles,
      BUILD_COMPLETE: built,
      EXTERNAL_ROUTES: JSON.stringify(external),
      ZINE_POSTS: JSON.stringify(zine),
      PROJECT_DOMAIN: process.env.PROJECT_DOMAIN,
      ENVIRONMENT: process.env.NODE_ENV || "dev",
      CONSTANTS: constants,
    });
  }

  const {CDN_URL} = constants.current;

  app.get('/~:domain', async (req, res) => {
    const {domain} = req.params;
    const project = await getProject(domain);
    if (!project) {
      await render(res, domain, `We couldn't find ~${domain}`);
      return;
    }
    const avatar = `${CDN_URL}/project-avatar/${project.id}.png`;
    await render(res, domain, project.description, avatar);
  });

  app.get('/@:name', async (req, res) => {
    const {name} = req.params;
    const team = await getTeam(name);
    if (team) {
      await render(res, team.name, team.description);
      return;
    }
    const user = await getUser(name);
    if (user) {
      await render(res, user.name || `@${user.login}`, user.description, user.avatarThumbnailUrl);
      return;
    }
    await render(res, `@${name}`, `We couldn't find @${name}`);
  });

  app.get('*', async (req, res) => {
    await render(res,
      "Glitch",
      "The friendly community where everyone can discover & create the best stuff on the web");
  });

  return app;
};
