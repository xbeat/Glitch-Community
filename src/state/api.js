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
    // TODO: handle user.emails?
    // subresources: ['emails'],
    referencedAs: ['user'],
  },
};

const getTable = (db, resource) => db.tables[resource] || db.tables[db.referencedAs[resource]];
const getAPIPath = ({ resource, key, children }) => (children ? `${resource}/by/${key}/${children}` : `${resource}/by/${key}`);

const getSingleItem = (db, request) => {
  const table = getTable(db, request.resource);
  if (request.key === 'id') return table[request.value];

  // get ID from secondary key
  const id = db.index[getAPIPath(request)];
  if (!id) return null;
  return table[id];
};

const getIndices = (db, request) => {
  // check if the parent exists and all indices can be used
  const parent = getSingleItem(db, { ...request, parent: null });
  // if not, just use index derivable from request
  if (!parent) return [getAPIPath(request)];
  
  const { secondaryKeys = [] } = db.schema[request.resource];
  const keys = ['id', ...secondaryKeys];
  return keys.map(key => getAPIPath({ ...request, key }))
}

const getChildren = (db, request) => {

  const indices = getIndices(db, request)
  let childIDs
  for 
  
  // check if the childIDs are stored under this index
  let childIDs = db.index[getAPIPath(request)][request.value];

  // check if the parent exists and other indices can be checked
  if (!childIDs) {
    const parent = getSingleItem(db, { ...request, parent: null });
    if (!parent) return null;
    const { secondaryKeys = [] } = db.schema[request.resource];
    const keys = ['id', ...secondaryKeys];
    for (const key of keys) {
      childIDs = db.index[getAPIPath({ ...request, key })][parent[key]];
      if (childIDs) break;
    }
  }
  return childIDs;
};

function createDB(schema) {
  const db = {
    schema,
    tables: {}, // resource -> id -> item
    index: {}, // apiPath -> key -> id | [id]
    referencedAs: {}, // ref -> resource
  };
  for (const [resource, params] of Object.entries(schema)) {
    const { secondaryKeys = [], references = [], referencedAs = [] } = params;
    db.tables[resource] = {};

    for (const children of references) {
      db.index[getAPIPath({ resource, key: 'id', children })] = {};
    }
    for (const key of secondaryKeys) {
      db.index[getAPIPath({ resource, key })] = {};
      for (const children of references) {
        db.index[getAPIPath({ resource, key, children })] = {};
      }
    }

    for (const ref of referencedAs) {
      db.referencedAs[ref] = resource;
    }
  }
  return db;
}

const data = {
  request: (resource, key, value, children) => ({ type: 'request', resource, key, value, children }),
  result: (result) => ({ type: 'result', result }),
};

const status = {
  loading: { status: 'loading' },
  ready: (value) => ({ status: 'ready', value }),
};

// db, request -> result | request
function checkDBForFulfillableRequests(db, request) {
  if (request.children) {
    const childIDsResult = getChildren(db, request);
    if (!childIDsResult) return request;
    if (childIDsResult.status === 'loading') return childIDsResult;

    const childTable = getTable(db, request.children);
    return data.result(childIDsResult.value.map((id) => childTable.data[id]));
  }

  const result = getSingleItem(db, request);
  if (!result) return request;
  return data.result(result);
}

// api, urlBase, [request] -> [Promise response]
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

function insertLoadingStatusIntoDB(db, request) {
  if (request.children) {
    
  }
}

function insertResponseIntoDB(db, { resource, response, parent }) {
  // insert items into the tables
  const table = getTable(db, resource);
  for (const item of response) {
    table[item.id] = status.ready(item);
  }
  // - if items has a parent, insert the ids into the references
  if (parent) {
    db.index[getAPIPath(parent)] = status.ready(response.map((item) => item.id));
  }
}

// request -> check db - request -> set 'loading' in db -> call api - response -> set 'ready' in db .
//                     - result  -> .
function createResourceManager({ version, schema, urlBase }) {}
