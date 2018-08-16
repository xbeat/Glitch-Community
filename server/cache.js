const fs = require("fs");
const axios = require("axios");
const util = require("util");
const moment = require('moment-mini');

const {API_URL} = require('./constants');

const fs_writeFile = util.promisify(fs.writeFile);

const categories = Promise.resolve('[]');

const getCategories = async () => {
  let response = await axios.get('categories', {
    baseUrl: API_URL,
    transformResponse: (data) => data // Don't bother parsing the JSON
  });
  console.log("☂️ categories updated");
  return response.data;
};

const updateCaches = async () => {
  // Wait until the catgegories are loaded then instantly swap
  // Otherwise every ten minutes requests would stall waiting on the api
  const newCategories = await getCategories();
  categories = Promise.resolve(newCategories);
};


const initCache = () => {
  const interval = moment.duration(10, 'minutes').asMilliseconds();
  setInterval(updateCaches, interval);
  categories = getCategories();
};

const getCache = () => {
  return {categories};
};

module.exports = {initCache, updateCaches};