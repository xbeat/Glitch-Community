/// A locally cached minimal api wrapper

const axios = require("axios");
const {Cache} = require("memory-cache");
const moment = require("moment-mini");

const {API_URL} = require("./constants");

const NOT_FOUND = Symbol();
const CACHE_TIMEOUT = moment.duration(10, 'minutes').asMilliseconds()

const projectCache = new Cache();
const userCache = new Cache();

async function getProject(domain) {
  let project = projectCache.get(domain);
  if (project === null) {
    const response = await axios.get(`${API_URL}/projects/${domain}`);
    project = response.data ? response.data : NOT_FOUND;
    projectCache.put(domain, project, 10000);
  }
  return project !== NOT_FOUND ? project : null;
}

async function getUser(login) {
  let user = userCache.get(login);
  if (user === null) {
    const response = await axios.get(`${API_URL}/users/byLogins?logins=${login}`);
    user = response.data.length ? response.data[0] : NOT_FOUND;
    userCache.put(login, user, 10000);
  }
  return user !== NOT_FOUND ? user : null;
}

module.exports = {getProject, getUser};