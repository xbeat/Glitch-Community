const axios = require("axios");
const moment = require('moment-mini');

const {API_URL} = require('./constants');

let categories = Promise.resolve('[]');

const getCategories = async () => {
  let response = await axios.get('categories', {
    baseURL: API_URL,
    //transformResponse: (data) => data // Don't bother parsing the JSON
  });
  console.log("☂️ categories updated");
  return response.data;
};

const updateCaches = async () => {
  // Wait until the catgegories are loaded then instantly swap
  try {
    const newCategories = await getCategories();
    categories = Promise.resolve(newCategories);
  } catch (error) {
    console.error(error);
  }
};

const initCaches = () => {
  const interval = moment.duration(10, 'minutes').asMilliseconds();
  setInterval(updateCaches, interval);
  categories = getCategories();
};

const getCaches = async () => {
  return JSON.stringify({
    categories: await categories,
  });
};

module.exports = {initCaches, updateCaches, getCaches};