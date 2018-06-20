/// A locally cached minimal api wrapper

const axios = require("axios");
const {Cache} = require("memory-cache");
const moment = require("moment-mini");

const {API_URL} = require("./constants");

const NOT_FOUND = Symbol();
const CACHE_TIMEOUT = moment.duration(15, 'minutes').asMilliseconds()

const projectCache = new Cache();
const userCache = new Cache();

async function getFromCacheOrApi(id, cache, api) {
  let item = cache.get(id);
  if (item === null) {
    item = (await api(id)) || NOT_FOUND;
    cache.put(id, item, CACHE_TIMEOUT);
  }
  return item !== NOT_FOUND ? item : null;
}

async function getProjectFromApi(domain) {
  const response = await axios.get(`${API_URL}/projects/${domain}`);
  return response.data;
}

async function getUserFromApi(login) {
  const response = await axios.get(`${API_URL}/users/byLogins?logins=${login}`);
  return response.data.length ? response.data[0] : null;
}

module.exports = {
  getProject: domain => getFromCacheOrApi(domain, projectCache, getProjectFromApi),
  getUser: login => getFromCacheOrApi(login, userCache, getUserFromApi),
};