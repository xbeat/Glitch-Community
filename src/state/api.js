/* globals API_URL */
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { memoize, groupBy, partition } from 'lodash';
import { useCurrentUser } from './current-user';
import { getAllPages } from '../../shared/api';

export const getAPIForToken = memoize((persistentToken) => {
  if (persistentToken) {
    return axios.create({
      baseURL: API_URL,
      headers: {
        Authorization: persistentToken,
      },
    });
  }
  return axios.create({
    baseURL: API_URL,
  });
});

export function useAPI() {
  const { persistentToken } = useCurrentUser();
  return getAPIForToken(persistentToken);
}

/*
Create a hook for working with the API via async functions.
Usage:

const useTeamsAPI = createAPIHook(async (api, teamID) => {
  const team = await api.get(`/team/${teamID}`);
  const { projectIDs } = team;
  team.projects = await Promise.all(projectIDs.map(projectID => api.get(`/project/${projectID})`));
  return team;
});

function TeamWithProjects ({ teamID }) {
  const { status, value } = useTeamsAPI(teamID)

  if (status === 'loading') {
    return <Loading />
  }

  // ... render the team ...
}

*/

// we don't want to set "stale" state, e.g. if the user clicks over to a different team's page
// while the first team's data is still loading, we don't want to show the first team's data when it loads.
// this should also avoid errors from setting state on an unmounted component.
function useAsyncEffectState(initialState, handler, asyncFuncArgs) {
  const [state, setState] = useState(initialState);
  const versionRef = useRef(0);
  useEffect(() => {
    const versionWhenEffectStarted = versionRef.current;
    const setStateIfFresh = (value) => {
      if (versionWhenEffectStarted === versionRef.current) {
        setState(value);
      }
    };
    handler(setStateIfFresh, versionWhenEffectStarted);
    return () => {
      versionRef.current += 1;
    };
  }, asyncFuncArgs);
  return state;
}

export const createAPIHook = (asyncFunction) => (...args) => {
  const api = useAPI();
  const loading = { status: 'loading' };
  const result = useAsyncEffectState(
    loading,
    async (setResult, version) => {
      // reset to 'loading' if the args change
      if (version > 0) {
        setResult(loading);
      }
      const value = await asyncFunction(api, ...args);
      setResult({ status: 'ready', value });
    },
    args,
  );
  return result;
};

const schema = {
  collections: {
    secondaryKeys: ['fullUrl'],
    references: ['projects'],
    belongsTo: ['team', 'user'],
  },
  projects: {
    secondaryKeys: ['domain'],
    references: ['collections', 'teams', 'users'],
    referencedAs: ['pinnedProjects', 'deletedProjects'],
  },
  teams: {
    secondaryKeys: ['url'],
    references: ['collections', 'projects', 'users', 'pinnedProjects'],
    referencedAs: ['team'],
  },
  users: {
    secondaryKeys: ['login'],
    references: ['collections', 'projects', 'teams', 'deletedProjects', 'pinnedProjects'],
    subresources: ['emails'],
    referencedAs: ['user'],
  },
};

// query('user', 'login', 'modernserf', 'emails')

const getTable = (db, tableName) => db.tables[tableName] || db.tables[db.referecedAs[tableName]];

const getPrimaryKey = (table, key, value) => {
  if (key === 'id') return value;
  // get ID from secondary key
  return table.index[key][value];
};

const getRequest = (resource, key, value, children) => ({ type: 'request', resource, key, value, children });

// db, request -> result | request
function checkDBForFulfillableRequests(db, request) {
  const { resource, key, value, children } = request;

  if (children) {
    const childTable = getTable(db, children);
    
    const childIDs = db.tables[getAPIPath(request)][
    
    if (!childIDs) return request;
    const result = childIDs.map((id) => childTable.data[id]);
    return { type: 'result', result }
    
    
    return flatMap(childID, (id) => checkDBForFulfillableRequests(db, childTable.id, 'id', id));
  }

  const table = getTable(db, resource);
  const id = getPrimaryKey(table, key, value);
  if (!id) return request;

  const result = table.data[id];
  if (!result) return request;
  return { type: 'result', result };
}

const getAPIPath = ({ resource, key, children }) => (children ? `${resource}/by/${key}/${children}` : `${resource}/by/${key}`);

// api, urlBase, [request] -> [response]
function getAPICallsForRequests(api, urlBase, requests) {
  const [withChildren, withoutChildren] = partition(requests, (req) => req.children);

  // TODO: make pagination, sort etc part of request
  // comes in an array of values
  const childResponses = withChildren.map(async (request) => {
    const response = await getAllPages(api, `${urlBase}/${getAPIPath(request)}?${request.key}=${request.value}`);
    return { type: 'response', resource: request.children, response, parent: request };
  });

  // join mergable requests
  // comes in a { key: value } format, but only the values are needed
  const joinedResponses = Object.entries(groupBy(withoutChildren, getAPIPath)).map(async ([apiPath, requests]) => {
    const { resource, key } = requests[0];
    const query = requests.map((req) => `${req.key}=${req.value}`).join(',');
    const response = await api.get(`${urlBase}/${apiPath}?${query}`);

    return { type: 'response', resource, response: Object.values(response) };
  });
  return [...childResponses, ...joinedResponses];
}

const loading = { status: 'loading' };
const ready = (value) => ({ status: 'ready', value });

// returns a set of changes to minimize the ammount of copying that is done
function insertResponseIntoDB(db, { resource, response, parent }) {
  const changes = [];
  const table = getTable(db, resource);
  const parentTable = parent ? getTable(db, parent.resource) : null
  for (const item of response) {
    changes.push([table.id, 'data', item.id, ready(item)]);
    // add links to secondary keys
    for (const secondaryKey of db.schema[table.id].secondaryKeys) {
      changes.push([table.id, 'index', item[secondaryKey], item.id]);
    }
  }

  // add relationships  
  if (parent) {
    changes.push([table.id, 'index', parentTable.id, parent.key, item.id])
    changes.push([parentTable.id, 'index', 
  }

  
  return changes;
}

// request -> check db - request -> set 'loading' in db -> call api - response -> set 'ready' in db .
//                     - result  -> .
function createResourceManager({ version, schema, urlBase }) {}
