/* eslint-disable prefer-default-export */
import algoliasearch from 'algoliasearch/lite';
import { useState, useEffect } from 'react';
import { groupBy, sample } from 'lodash';
import { useAPI } from './api';
import { allByKeys } from '../../shared/api';
import useErrorHandlers from '../presenters/error-handlers';

const searchClient = algoliasearch('LAS7VGSQIQ', '27938e7e8e998224b9e1c3f61dd19160');

const searchIndex = searchClient.initIndex('search');

// TODO: all this really ought to be in the raw data
function formatUser(hit) {
  return {
    ...hit,
    id: Number(hit.objectID.split('-')[1]),
    thanksCount: hit.thanks,
    hasCoverImage: false,
    color: '',
  };
}

function formatTeam(hit) {
  return {
    ...hit,
    id: Number(hit.objectID.split('-')[1]),
    hasCoverImage: false,
    hasAvatarImage: false,
    isVerified: false,
    url: '',
    users: [],
  };
}

function formatProject(hit) {
  return {
    ...hit,
    id: hit.objectID.replace('project-', ''),
    description: '',
    users: [],
    showAsGlitchTeam: false,
    teams: [],
  };
}

function formatCollection(hit) {
  return {
    ...hit,
    id: Number(hit.objectID.split('-')[1]),
    coverColor: sample(['#cff', '#fcf', '#ffc', '#ccf', '#cfc', '#fcc']),
    projects: [],
    url: '',
    teamId: hit.team,
    userId: hit.user,
    team: hit.team > 0 ? { id: hit.team, url: '' } : null,
    user: hit.user > 0 ? { id: hit.user, login: '' } : null,
  };
}

// starter kits
const starterKits = [
  {
    id: 1,
    type: 'starter-kit',
    keywords: ['react'],
    imageURL: 'https://glitch.com/culture/content/images/2018/10/react-starter-kit-1.jpg',
    name: 'Build a Web App with React',
    url: 'https://glitch.com/culture/react-starter-kit/',
    description: 'A free, 5-part video course with interactive code examples that will help you learn React.',
    coverColor: '#f0fcff',
  },
  {
    id: 2,
    type: 'starter-kit',
    keywords: ['website'],
    imageURL: 'https://glitch.com/culture/content/images/2018/10/website-starter-kit-1.jpg',
    name: 'How to Make a Website',
    url: 'https://glitch.com/culture/website-starter-kit/',
    description: 'A free, 4-part video course with interactive code examples to learn how to make a website using HTML, JS, CSS, and Node.js.',
    coverColor: '#efe',
  },
  {
    id: 3,
    type: 'starter-kit',
    keywords: ['vr', 'webvr'],
    imageURL: 'https://glitch.com/culture/content/images/2019/02/WebVR-Starter-Kit.-Part-1_-Intro-to-WebVR-1.png',
    name: 'An Intro to WebVR',
    url: 'https://glitch.com/culture/an-intro-to-webvr/',
    description: 'A free, 5-part video course with interactive code examples that will teach you the fundamentals of WebVR using A-Frame.',
    coverColor: '#fee',
  },
];

const normalize = (str) => (str || '').trim().toLowerCase();

function findStarterKit(query) {
  const normalizedQuery = normalize(query);
  return starterKits.find((kit) => kit.keywords.includes(normalizedQuery));
}

// top results

// byPriority('domain', 'name') -- first try to match domain, then try matching name, then return `null`
const byPriority = (...prioritizedKeys) => (items, query) => {
  const normalizedQuery = normalize(query);
  for (const key of prioritizedKeys) {
    const match = items.find((item) => normalize(item[key]) === normalizedQuery);
    if (match) return match;
  }
  return null;
};

const findTop = {
  project: byPriority('domain', 'name'),
  team: byPriority('url', 'name'),
  user: byPriority('login', 'name'),
};

const getTopResults = (resultsByType, query) =>
  [
    findTop.project(resultsByType.project, query),
    findTop.team(resultsByType.team, query),
    findTop.user(resultsByType.user, query),
  ].filter(Boolean);

function formatHit(hit) {
  switch (hit.type) {
    case 'user':
      return formatUser(hit);
    case 'team':
      return formatTeam(hit);
    case 'project':
      return formatProject(hit);
    case 'collection':
      return formatCollection(hit);
    default:
      return hit;
  }
}

const emptyResults = { team: [], user: [], project: [], collection: [] };

export function useAlgoliaSearch(query) {
  const [hits, setHits] = useState([]);
  useEffect(() => {
    if (!query) {
      setHits([]);
      return;
    }
    searchIndex
      .search({
        query,
        hitsPerPage: 500,
      })
      .then((res) => setHits(res.hits.map(formatHit)));
  }, [query]);

  const resultsByType = { ...emptyResults, ...groupBy(hits, (hit) => hit.type) };

  return {
    status: 'ready',
    totalHits: hits.length,
    topResults: getTopResults(resultsByType, query),
    ...resultsByType,
  };
}

const formatLegacyResult = (type) => (hit) => ({
  ...hit,
  type,
});

async function searchTeams(api, query) {
  const { data } = await api.get(`teams/search?q=${query}`);
  return data.map(formatLegacyResult('team'));
}

async function searchUsers(api, query) {
  const { data } = await api.get(`users/search?q=${query}`);
  return data.map(formatLegacyResult('user'));
}

async function searchProjects(api, query) {
  const { data } = await api.get(`projects/search?q=${query}`);
  return data.map(formatLegacyResult('project'));
}

// This API is slow and is missing important data (so its unfit for production)
// But its still useful for comparing against Algolia
// eslint-disable-next-line no-unused-vars
async function searchCollections(api, query) {
  const { data } = await api.get(`collections/search?q=${query}`);
  // NOTE: collection URLs don't work correctly with these
  return data.map((coll) => ({
    ...coll,
    type: 'collection',
    team: coll.teamId > 0 ? { id: coll.teamId } : null,
    user: coll.userId > 0 ? { id: coll.userId } : null,
  }));
}

export function useLegacySearch(query) {
  const api = useAPI();
  const { handleError } = useErrorHandlers();
  const [results, setResults] = useState(emptyResults);
  const [status, setStatus] = useState('init');
  useEffect(() => {
    setStatus('loading');
    allByKeys({
      team: searchTeams(api, query),
      user: searchUsers(api, query),
      project: searchProjects(api, query),
      // collection: searchCollections(api, query),
      collection: Promise.resolve([]),
    })
      .then((res) => {
        setStatus('ready');
        setResults(res);
      })
      .catch(handleError);
  }, [query]);

  //   TODO: do I need total hits?
  const allHits = [...results.team, ...results.user, ...results.project, ...results.collection];

  return {
    ...emptyResults,
    status,
    totalHits: allHits.length,
    topResults: getTopResults(results, query),
    starterKit: findStarterKit(query),
    ...results,
  };
}
