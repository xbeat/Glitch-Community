const fs = require("fs");
const axios = require("axios");
const util = require("util");
const moment = require('moment-mini');

const {API_URL} = require('./constants');

const fs_writeFile = util.promisify(fs.writeFile);

const cache = null;

const getCategories = async () => {
  let response = await axios.get('categories', {
    baseUrl: API_URL,
    transformResponse: (data) => data // Don't bother parsing the JSON
  });
  return response.data;
};

const updateCaches = async () => {
  await updateCache('categories');
  console.log("☂️ cache updated");
};


const initCache = () => {
  const interval = moment.duration(10, 'minutes').asMilliseconds();
  setInterval(updateCaches, interval);
  updateCaches();
};

const getCache = () => {
  return {categories};
};

module.exports = {initCache, updateCaches};