const fs = require("fs");
const axios = require("axios");
const util = require("util");
const express = require('express');
const moment = require('moment-mini');

const CACHE_INTERVAL = 1000 * 60 * 10; // 10 minutes

const fs_writeFile = util.promisify(fs.writeFile);

const API_URL = ((process.env.RUNNING_ON === 'staging')
                 ? 'https://api.staging.glitch.com/'
                 : 'https://api.glitch.com/');

const updateCache = async type => {
  let response = await axios.get(`${API_URL}${type}`, {
    transformResponse: (data) => data // Override the default object transform
  });
  let json = response.data;
  
  if(type === 'teams') {
    let teams = JSON.parse(json);
    let reduced = teams.map(({id, name, url}) => ({id, name, url}));
    json = JSON.stringify(reduced);
  }
  
  try {
    let fileContents = `export default ${json}`
    await fs_writeFile(`./src/cache/${type}.js`, fileContents);
    console.log(`☂️ ${type} re-cached`);
  } catch (error) {
    console.error("☔️", error);
  }
};

const updateCaches = async () => {
  await updateCache('categories');
  await updateCache('teams');
  console.log("☂️ cache updated");
};

updateCaches();
setInterval(updateCaches, CACHE_INTERVAL);

module.exports = function() {
  
  const app = express.Router();
  
  // CORS - Allow pages from any domain to make requests to our API
  app.use(function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    return next();
  });
  
  // Caching - js files have a hash in their name, so they last a long time
  app.use('/*.js', (request, response, next) => {
    const ms = moment.duration(30, 'days').milliseconds();
    response.header("Cache-Control", `public, max-age=${ms}`);
    return next();
  });
  
  app.use(express.static('public'));

  // Log all requests for diagnostics
  app.use(function(request, response, next) {
    console.log(request.method, request.originalUrl, request.body);
    return next();
  });

  app.post('/update-caches', (request, response) =>
    updateCaches()
    .then(() => response.sendStatus(200))
  );

  return app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
  });
};
