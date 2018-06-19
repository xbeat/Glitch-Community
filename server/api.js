/// A locally cached minimal api wrapper

const axios = require("axios");
const {Cache} = require("memory-cache");

const {API_URL} = require("./constants");

const NOT_FOUND = Symbol();

const projectCache = new Cache();
async function getProject(domain) {
  let project = projectCache.get(domain);
  if (project === null) {
    console.log('update ', domain);
    const response = await axios.get(`${API_URL}/projects/${domain}`);
    project = response.data ? response.data : NOT_FOUND;
    projectCache.put(domain, project, 10000);
  }
  return project !== NOT_FOUND ? project : null;
}

module.exports = {getProject};