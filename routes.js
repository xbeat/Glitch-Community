const fs = require("fs");
const axios = require("axios");
const util = require("util");
const express = require('express');
const moment = require('moment-mini');

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
    const ms = moment.duration(1, 'months').asMilliseconds();
    response.header('Cache-Control', `public, max-age=${ms}`);
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
    res.render(__dirname + '/public/index.ejs', {
    });
  });
};
