/* eslint-disable prefer-default-export */
import algoliasearch from 'algoliasearch/lite';
import { useState, useEffect } from 'react';
import { mapValues, sumBy } from 'lodash';
import { useAPI } from './api';
import { allByKeys } from '../../shared/api';
import useErrorHandlers from '../presenters/error-handlers';
import starterKits from '../curated/starter-kits';

const searchClient = algoliasearch('LAS7VGSQIQ', '27938e7e8e998224b9e1c3f61dd19160');

// TODO: this is super hacky; this would probably work a lot better with algolia
const normalize = (str) =>
  (str || '')
    .trim()
    .replace(/[^\w\d\s]/g, '')
    .toLowerCase();

function findStarterKits(query) {
  const normalizedQuery = normalize(query);
  return starterKits.filter((kit) => kit.keywords.includes(normalizedQuery));
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
  [findTop.project(resultsByType.project, query), findTop.team(resultsByType.team, query), findTop.user(resultsByType.user, query)].filter(Boolean);

function useSearchProvider(provider, query) {
  const emptyResults = mapValues(provider, () => []);
  const [results, setResults] = useState(emptyResults);
  const [status, setStatus] = useState('init');
  useEffect(() => {
    if (!query) {
      setResults(emptyResults);
      return;
    }
    setStatus('loading');
    allByKeys(mapValues(provider, (index) => index(query))).then((res) => {
      setResults(res);
      setStatus('ready');
    });
  }, [query]);

  const totalHits = sumBy(Object.values(results), (items) => items.length);

  return {
    ...emptyResults,
    status,
    totalHits,
    topResults: getTopResults(results, query),
    ...results,
  };
}

const searchIndices = {
  team: searchClient.initIndex('search_teams'),
  user: searchClient.initIndex('search_users'),
  project: searchClient.initIndex('search_projects'),
  collection: searchClient.initIndex('search_collections'),
};

const algoliaProvider = {
  ...mapValues(searchIndices, (index, type) => (query) => index.search({ query }).then((value) => ({ type, value }))),
  starterKit: (query) => Promise.resolve(findStarterKits(query)),
};

export function useAlgoliaSearch(query) {
  return useSearchProvider(algoliaProvider, query);
}

const legacyProvider = {
  team: async (api, query) => {
  const { data } = await api.get(`teams/search?q=${query}`);
  return data.map(formatLegacyResult('team'));
}
}

const formatLegacyResult = (type) => (hit) => ({ ...hit, type });



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
    starterKit: findStarterKits(query),
    ...results,
  };
}
