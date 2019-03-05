/// A locally cached minimal api wrapper

const axios = require("axios");
const {Cache} = require("memory-cache");
const dayjs = require("dayjs");

const {API_URL} = require("./constants").current;
const {getFromApi} = require("../shared/api");

const CACHE_TIMEOUT = dayjs.convert(15, 'minutes', 'ms');

const generalCache = new Cache();
const projectCache = new Cache();
const teamCache = new Cache();
const userCache = new Cache();

async function getFromCacheOrApi(id, cache, api) {
  let promise = cache.get(id);
  if (!promise) {
    promise = api(id);
    cache.put(id, promise, CACHE_TIMEOUT);
  }
  try {
    const value = await promise;
    return value;
  } catch (error) {
    console.error(error.toString());
    return null;
  }
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

async function getProjectFromApi(domain) {
  try {
    const data = await getFromApi(api, `v1/projects/by/domain?domain=${domain}`);
    return data[domain];
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
}

async function getTeamFromApi(url) {
  try {
    const data = await getFromApi(api, `v1/teams/by/url?url=${url}`);
    return data[url];
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
}

async function getUserFromApi(login) {
  try {
    const data = await getFromApi(api, `v1/users/by/login?login=${login}`);
    return data[login];
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
}

async function getCultureZinePosts() {
  console.log('Fetching culture zine posts');
  const client = 'client_id=ghost-frontend&client_secret=c9a97f14ced8';
  const params = 'filter=featured:true&limit=4&fields=id,title,url,feature_image,primary_tag&include=tags';
  try {
    const response = await api.get(`https://culture-zine.glitch.me/culture/ghost/api/v0.1/posts/?${client}&${params}`);
    return response.data.posts;
  } catch (error) {
    return null;
  }
}

module.exports = {
  getProject: domain => getFromCacheOrApi(domain, projectCache, getProjectFromApi),
  getTeam: url => getFromCacheOrApi(url, teamCache, getTeamFromApi),
  getUser: login => getFromCacheOrApi(login, userCache, getUserFromApi),
  getZine: () => getFromCacheOrApi('culture', generalCache, getCultureZinePosts),
};