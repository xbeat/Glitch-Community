const axios = require("axios");
const moment = require('moment-mini');

const {API_URL} = require('./constants');

let categories; // a promise that returns a json string

const getCategories = async () => {
  let response = await axios.get('categories', {
    baseURL: API_URL,
    transformResponse: (data) => data // Don't bother parsing the JSON
  });
  return response.data;
};

const updateCaches = async () => {
  // Wait until the categories are loaded then instantly swap
  try {
    const newCategories = await getCategories();
    categories = Promise.resolve(newCategories);
    console.log("☂️ categories updated");
  } catch (error) {
    console.error(error);
  }
};

const initCaches = () => {
  const interval = moment.duration(10, 'minutes').asMilliseconds();
  setInterval(updateCaches, interval);
  categories = getCategories();
};

module.exports = {
  initCaches,
  updateCaches,
  getCategories: () => categories,
};