const fs = require("fs");
const axios = require("axios");
const util = require("util");
const moment = require('moment-mini');

const {API_URL} = require('./constants');

const fs_writeFile = util.promisify(fs.writeFile);

const updateCache = async type => {
  let response = await axios.get(`${API_URL}${type}`, {
    transformResponse: (data) => data // Override the default object transform
  });
  let json = response.data;
  
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
  console.log("☂️ cache updated");
};

const CACHE_INTERVAL = moment.duration(10, 'minutes').asMilliseconds();

const initCache = () => {
  setInterval(updateCaches, CACHE_INTERVAL);
  updateCaches();
};

module.exports = {initCache, updateCaches};