/* eslint-disable prefer-default-export */
import algoliasearch from 'algoliasearch/lite';
import { useState, useEffect } from 'react';
import { groupBy } from 'lodash';

const searchClient = algoliasearch('LAS7VGSQIQ', '27938e7e8e998224b9e1c3f61dd19160');

const searchIndex = searchClient.initIndex('search');

// TODO: all this really ought to be in the raw data
function formatUser (hit) {
  return {
    id: Number(hit.objectID.split('-')[1]),
    thanksCount: hit.thanks,
    hasCoverImage: false,
    ...hit,
  }
}

function formatTeam (hit) {
  return {
    id: Number(hit.objectID.split('-')[1]),
    hasCoverImage: false,
    hasAvatarImage: false,
    isVerified: false,
    url: '',
    users: [],
    ...hit,
  }
}

function formatProject (hit) {
  return {
    id: hit.objectID.split('-')[1],
    users: [],
    showAsGlitchTeam: false,
    ...hit,
    teams: [],
  }
}

function formatHit(hit) {
  switch (hit.type) {
    case 'user':
      return formatUser(hit)
    case 'team':
      return formatTeam(hit)
    case 'project':
      return formatProject(hit)
    default:
      return hit
  }
}

const emptyResults = { team: [], user: [], project: [] };

const MAX_RESULTS = 20;

export function useSearch(query) {
  const [hits, setHits] = useState([]);
  useEffect(() => {
    searchIndex.search({ 
      query, 
      hitsPerPage: 500,
      // TODO: remove this line, add collections to search
      filters: 'type:"user" OR type:"project" OR type:"team"',
    }).then((res) => setHits(res.hits.map(formatHit)));
  }, [query]);
  
  const grouped = { ...emptyResults,  };
  
  return {
    ...emptyResults,
    status: query ? 'ready' : 'init',
    hits,
    ...groupBy(hits, (hit) => hit.type),
  };
}

async function searchTeams(api, query) {
  const { data } = await api.get(`teams/search?q=${query}`);
  return data.slice(0, MAX_RESULTS)
}

async function searchUsers() {
  const { api, query } = this.props;
  const { data } = await api.get(`users/search?q=${query}`);
  this.setState((prevState) => ({
    users: data.slice(0, MAX_RESULTS),
    loadedResults: prevState.loadedResults + 1,
  }));
}

async function searchProjects() {
  const { api, query } = this.props;
  const { data } = await api.get(`projects/search?q=${query}`);
  this.setState((prevState) => ({
    projects: data.filter((project) => !project.notSafeForKids).slice(0, MAX_RESULTS),
    loadedResults: prevState.loadedResults + 1,
  }));
}

export function useLegacySearch(query) {

}
