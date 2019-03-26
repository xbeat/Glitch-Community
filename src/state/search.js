/* eslint-disable prefer-default-export */
import algoliasearch from 'algoliasearch/lite';
import { useState, useEffect } from 'react';
import { groupBy } from 'lodash';
import { useAPI } from './api';
import { allByKeys } from '../../shared/api';

const searchClient = algoliasearch('LAS7VGSQIQ', '27938e7e8e998224b9e1c3f61dd19160');

const searchIndex = searchClient.initIndex('search');

// TODO: all this really ought to be in the raw data
function formatUser(hit) {
  return {
    id: Number(hit.objectID.split('-')[1]),
    thanksCount: hit.thanks,
    hasCoverImage: false,
    ...hit,
  };
}

function formatTeam(hit) {
  return {
    id: Number(hit.objectID.split('-')[1]),
    hasCoverImage: false,
    hasAvatarImage: false,
    isVerified: false,
    url: '',
    users: [],
    ...hit,
  };
}

function formatProject(hit) {
  return {
    id: hit.objectID.split('-')[1],
    users: [],
    showAsGlitchTeam: false,
    ...hit,
    teams: [],
  };
}

function formatHit(hit) {
  switch (hit.type) {
    case 'user':
      return formatUser(hit);
    case 'team':
      return formatTeam(hit);
    case 'project':
      return formatProject(hit);
    default:
      return hit;
  }
}

const emptyResults = { team: [], user: [], project: [] };

const MAX_RESULTS = 20;

export function useAlgoliaSearch(query) {
  const [hits, setHits] = useState([]);
  useEffect(() => {
    searchIndex
      .search({
        query,
        hitsPerPage: 500,
        // TODO: remove this line, add collections to search
        filters: 'type:"user" OR type:"project" OR type:"team"',
      })
      .then((res) => setHits(res.hits.map(formatHit)));
  }, [query]);

  return {
    ...emptyResults,
    status: 'ready',
    totalHits: hits.length,
    ...groupBy(hits, (hit) => hit.type),
  };
}

async function searchTeams(api, query) {
  const { data } = await api.get(`teams/search?q=${query}`);
  return data.slice(0, MAX_RESULTS);
}

async function searchUsers(api, query) {
  const { data } = await api.get(`users/search?q=${query}`);
  return data.slice(0, MAX_RESULTS);
}

async function searchProjects(api, query) {
  const { data } = await api.get(`projects/search?q=${query}`);
  return data.slice(0, MAX_RESULTS);
}

export function useLegacySearch(query) {
  const api = useAPI();
  const [results, setResults] = useState(emptyResults);
  const [status, setStatus] = useState('init');
  useEffect(() => {
    setStatus('loading');
    allByKeys({
      team: searchTeams(api, query),
      user: searchUsers(api, query),
      project: searchProjects(api, query),
    }).then((res) => {
      setStatus('ready');
      setResults(res);
    });
  }, [query]);
  return {
    status,
    totalHits: results.team.length + results.user.length + results.project.length,
    ...results,
  };
}
