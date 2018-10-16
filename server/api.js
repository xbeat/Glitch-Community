/// A locally cached minimal api wrapper

const axios = require("axios");
const {Cache} = require("memory-cache");
const moment = require("moment-mini");

const {API_URL} = require("./constants");

const CACHE_TIMEOUT = moment.duration(15, 'minutes').asMilliseconds()

const projectCache = new Cache();
const teamCache = new Cache();
const userCache = new Cache();

async function getFromCacheOrApi(id, cache, api, def=null) {
  let promise = cache.get(id);
  if (!promise) {
    promise = api(id);
    cache.put(id, promise, CACHE_TIMEOUT);
  }
  try {
    const value = await promise;
    return value || def;
  } catch (error) {
    return def;
  }
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

async function getProjectFromApi(domain) {
  try {
    const response = await api.get(`/projects/${domain}`);
    return response.data;
  } catch (error) {
    return null;
  }
}

async function getTeamFromApi(url) {
  try {
    const response = await api.get(`/teams/byUrl/${url}`);
    return response.data;
  } catch (error) {
    return null;
  }
}

async function getUserFromApi(login) {
  try {
    const {data} = await api.get(`/userId/byLogin/${login}`);
    if (data === 'NOT FOUND') return null;
    const response = await api.get(`/users/${data}`);
    return response.data;
  } catch (error) {
    return null;
  }
}

module.exports = {
  getProject: domain => getFromCacheOrApi(domain, projectCache, getProjectFromApi),
  getTeam: url => getFromCacheOrApi(url, teamCache, getTeamFromApi),
  getUser: login => getFromCacheOrApi(login, userCache, getUserFromApi),
};