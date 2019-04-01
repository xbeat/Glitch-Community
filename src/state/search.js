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
    coverColor: sample(['#cff', '#fcf', '#ffc', '#ccf', '#cfc', '#fcc' ]),
    projects: [],
    url: '',
    team: hit.team > 0 ? { id: hit.team, url: '' } : null,
    user: hit.user > 0 ? { id: hit.user, login: '', color: '#efe' } : null,
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

  return {
    ...emptyResults,
    status: 'ready',
    totalHits: hits.length,
    ...groupBy(hits, (hit) => hit.type),
  };
}

async function searchTeams(api, query) {
  const { data } = await api.get(`teams/search?q=${query}`);
  return data;
}

async function searchUsers(api, query) {
  const { data } = await api.get(`users/search?q=${query}`);
  return data;
}

async function searchProjects(api, query) {
  const { data } = await api.get(`projects/search?q=${query}`);
  return data;
}

// This API is slow and is missing important data (so its unfit for production)
// But its still useful for comparing against Algolia
// eslint-disable-next-line no-unused-vars
async function searchCollections(api, query) {
  const { data } = await api.get(`collections/search?q=${query}`);
  // NOTE: collection URLs don't work correctly with these
  return data.map((coll) => ({
    ...coll,
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
  return {
    ...emptyResults,
    status,
    totalHits: results.team.length + results.user.length + results.project.length + results.collection.length,
    ...results,
  };
}
