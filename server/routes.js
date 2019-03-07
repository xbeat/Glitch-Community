const express = require('express');
const fs = require('fs');
const util = require('util');
const dayjs = require('dayjs');

const {getProject, getTeam, getUser, getZine} = require('./api');
const initWebpack = require('./webpack');
const constants = require('./constants');

module.exports = function(external) {
  const app = express.Router();

  // CORS - Allow pages from any domain to make requests to our API
  app.use(function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // security headers 10, 5, 20, 25 (we need 55 total)
    response.header("X-XSS-Protection", "1; mode=block");
    response.header("X-Content-Type-Options", "nosniff");
    //response.header("Strict-Transport-Security", "max-age=6307200");
    // response.header("Content-Security-Policy", "https:");
    return next();
  });
  
  initWebpack(app);
  const buildTime = dayjs();

  const ms = dayjs.convert(7, 'days', 'miliseconds');
  app.use(express.static('public', { index: false }));
  app.use(express.static('build', { index: false, maxAge: ms }));

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
      const stats = JSON.parse(await readFilePromise('build/stats.json'));
      stats.entrypoints.styles.assets.forEach(file => {
        if (file.match(/\.css(\?|$)/)) {
          styles.push(`${stats.publicPath}${file}`);
        }
      });
      stats.entrypoints.client.assets.forEach(file => {
        if (file.match(/\.js(\?|$)/)) {
          scripts.push(`${stats.publicPath}${file}`);
        }
        if (file.match(/\.css(\?|$)/)) {
          styles.push(`${stats.publicPath}${file}`);
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
      BUILD_TIMESTAMP: buildTime.toISOString(),
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
  
  app.get('/auth/:domain', async (req, res) => {
    const {domain} = req.params;
    
    res.render('api-auth.ejs', {
      domain: domain,
      CONSTANTS: constants,
    });
  });
  
  app.get('*', async (req, res) => {
    await render(res,
      "Glitch",
      "The friendly community where everyone can discover & create the best stuff on the web");
  });

  return app;
};
