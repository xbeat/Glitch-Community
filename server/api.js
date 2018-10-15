/// A locally cached minimal api wrapper

const axios = require("axios");
const {Cache} = require("memory-cache");
const moment = require("moment-mini");

const {API_URL} = require("./constants");

const NOT_FOUND = Symbol();
const CACHE_TIMEOUT = moment.duration(15, 'minutes').asMilliseconds()

const projectCache = new Cache();
const teamCache = new Cache();
const userCache = new Cache();

async function getFromCacheOrApi(id, cache, api, def=null) {
  let promise = cache.get(id);
  if (!promise) {
    promise = async () => {
      try {
        return (await api(id)) || NOT_FOUND;
      } catch (error) {
        // Technically anything other than a 404 is a 'real' error
        // but for our usage we can just go on as if it doesn't exist
        return NOT_FOUND;
      }
    };
    cache.put(id, promise, CACHE_TIMEOUT);
  }
  const value = await promise;
  return value !== NOT_FOUND ? value : def;
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

async function getProjectFromApi(domain) {
  const response = await api.get(`/projects/${domain}`);
  return response.data;
}

async function getTeamFromApi(url) {
  const response = await api.get(`/teams/byUrl/${url}`);
  return response.data;
}

async function getUserFromApi(login) {
  const {data} = await api.get(`/userId/byLogin/${login}`);
  if (data === 'NOT FOUND') return null;
  const response = await api.get(`/users/${data}`);
  return response.data;
}

module.exports = {
  getProject: domain => getFromCacheOrApi(domain, projectCache, getProjectFromApi),
  getTeam: url => getFromCacheOrApi(url, teamCache, getTeamFromApi),
  getUser: login => getFromCacheOrApi(login, userCache, getUserFromApi),
};