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

const getChildIDs = (childTable, parentTable, parentID) => childTable.index[parentTable.id][parentID];

const getRequest = (resource, key, value, children) => ({ type: 'request', resource, key, value, children });

function checkDBForFulfillableRequests (db, request) {
  const { resource, key, value, children } = request;

  if (children) {
    const childTable = getTable(db, children);
    const parentTable = getTable(db, resource);
    const parentID = getPrimaryKey(parentTable, key, value);
    // if cant find parent, request both parent and children
    if (!parentID) return [request, getRequest(resource, key, value)];

    const childIDs = getChildIDs(childTable, parentTable, parentID);
    if (!childIDs) return [request];
    return childIDs.map((id) => query(db, childTable.id, 'id', id));
  }

  const table = getTable(db, resource);
  const id = getPrimaryKey(table, key, value);
  if (!id) return [request];

  const result = table.data[id];
  if (!result) return [request];
  return [{ type: 'result', result }];
}

const getAPIPath = ({ resource, key, children }) => 
  children ? `${resource}/by/${key}/${children}` : `${resource}/by/${key}`

function getAPICallsForRequests (api, urlBase, requests) {
  const [withChildren, withoutChildren] = partition(requests, (req) => req.children)
  
  // TODO: make pagination, sort etc part of request  
  const childResponses = withChildren.map(async request => {
    const response = await getAllPages(api, `${urlBase}/${getAPIPath(request)}?${request.key}=${request.value}`)
    const { resource, key, children } = request
    return { type: 'response', resource, key, children, response }
  })
  
  // join mergable requests
  const joinedResponses = Object.entries(groupBy(withoutChildren, getAPIPath))
    .map(async ([apiPath, requests]) => {
      const { resource, key } = requests[0]
      const query = requests.map(req => `${req.key}=${req.value}`).join(',')
      const response = await api.get(`${urlBase}/${apiPath}?${query}`)
      return { type: 'response', resource, key, response }
    })
  return [...childResponses, 
}

function flushPendingRequests () {
      
}

function createResourceManager({ version, schema, urlBase }) {
  const db = createDatabase(schema)
  const reducer = createResourceReducer(db)
  const useResource = createResourceMiddleware(
}
