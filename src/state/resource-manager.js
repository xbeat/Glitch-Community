import React, { createContext, useContext, useState, useEffect } from 'react'
import { groupBy, partition } from 'lodash';
import produce from 'immer';
import { getAllPages } from '../../shared/api';
import { useAPI } from './api';

const getTable = (db, resource) => db.tables[resource] || db.tables[db.referencedAs[resource]];
const getAPIPath = ({ resource, key, children }) => (children ? `${resource}/by/${key}/${children}` : `${resource}/by/${key}`);
// shamefully, javascript does not have any native support for structural equality.
const getRequestHashcode = (request) => `${getAPIPath(request)}?${request.value}`;

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
  if (!parent) return [{ value: request.value, index: getAPIPath(request) }];

  const { secondaryKeys = [] } = db.schema[request.resource];
  const keys = ['id', ...secondaryKeys];
  return keys.map((key) => ({ value: parent[key], index: getAPIPath({ ...request, key }) }));
};

const getChildren = (db, request) => {
  const indices = getIndices(db, request);
  return indices.find(({ value, index }) => db.index[index][value]);
};

// request = { resource, key, value, childResource? }
// maps to url `/:resource/by/:key/:childResource?:key=:value`

const status = {
  loading: { status: 'loading' },
  ready: (value) => ({ status: 'ready', value }),
};

// db, request -> result?
function checkDBForFulfillableRequests(db, request) {
  if (request.childResource) {
    const childIDsResult = getChildren(db, request);
    if (!childIDsResult) return null;
    if (childIDsResult.status === 'loading') return childIDsResult;

    const childTable = getTable(db, request.childResource);
    return childIDsResult.value.map((id) => childTable.data[id]);
  }

  return getSingleItem(db, request);
}

// api, urlBase, [request] -> [Promise response]
function getAPICallsForRequests(api, urlBase, requests) {
  const [withChildren, withoutChildren] = partition(requests, (req) => req.childResource);

  // TODO: make pagination, sort etc part of request
  // comes in an array of values
  const childResponses = withChildren.map(async (request) => {
    const response = await getAllPages(api, `${urlBase}/${getAPIPath(request)}?${request.key}=${request.value}`);
    return { type: 'response', resource: request.childResource, response, parent: request };
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

// these look like they're mutating, but they're really using `immer`
// see https://github.com/mweststrate/immer
function insertLoadingStatusIntoDB(db, request) {
  if (request.childResource) {
    for (const { index, value } of getIndices(db, request)) {
      db.index[index][value] = status.loading;
    }
  } else if (request.key !== 'id') {
    db.index[getAPIPath(request)][request.value] = status.loading;
  } else {
    const table = getTable(db, request.resource);
    table[request.value] = status.loading;
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
    const readyIDs = status.ready(response.map((item) => item.id));
    for (const { index, value } of getIndices(db, parent)) {
      db.index[index][value] = readyIDs;
    }
  }
}

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

    for (const childResource of references) {
      db.index[getAPIPath({ resource, key: 'id', childResource })] = {};
    }
    for (const key of secondaryKeys) {
      db.index[getAPIPath({ resource, key })] = {};
      for (const childResource of references) {
        db.index[getAPIPath({ resource, key, childResource })] = {};
      }
    }

    for (const ref of referencedAs) {
      db.referencedAs[ref] = resource;
    }
  }
  return db;
}

const actions = {
  requestQueued: (payload) => ({ type: 'requestQueued', payload }),
  responseQueued: (payload) => ({ type: 'responseQueued', payload }),
  batchesFlushed: () => ({ type: 'batchesFlushed' }),
};

const getInitialState = (schema) => ({
  db: createDB(schema),
  requests: {},
  responses: [],
});

const reducer = (state, action) => {
  switch (action.type) {
    // if a request cannot be fulfilled immediately, it is added to the requests batch.
    // requests are deduped.
    case 'requestQueued':
      return produce(state, (draft) => {
        const request = action.payload;
        draft.requests[getRequestHashcode(request)] = request;
      });
    // responses are also batched, and do not need to be deduped.
    case 'responseQueued':
      return produce(state, (draft) => {
        draft.responses.push(action.payload);
      });
    // periodically the batches are flushed:
    // requests are fetched from the API, and responses are written to the DB.
    case 'batchesFlushed':
      return produce(state, (draft) => {
        draft.requests = {};
        draft.responses = [];
        Object.values(state.requests).forEach((request) => insertLoadingStatusIntoDB(draft.db, request));
        state.responses.forEach((response) => insertResponseIntoDB(draft.db, response));
      });
    default:
      return state;
  }
};

function flushBatchesAtInterval(api, urlBase, store, interval) {
  const handle = setInterval(() => {
    const { requests } = store.getState();
    store.dispatch(actions.batchesFlushed());
    getAPICallsForRequests(api, urlBase, requests).forEach(async (responsePromise) => {
      const response = await responsePromise;
      store.dispatch(actions.responseQueued(response));
    });
  }, interval);

  return () => clearInterval(handle);
}

function query(store, request) {
  const result = checkDBForFulfillableRequests(store.getState().db, request);
  if (result) return result;

  // don't dispatch in the middle of a render
  setTimeout(() => {
    store.dispatch(actions.requestQueued(request));
  }, 1);

  return status.loading;
}

export function createStore(schema) {
  let state = getInitialState(schema);
  const subscriptions = [];
  const dispatch = (action) => {
    state = reducer(state, action);
    subscriptions.forEach((sub) => sub());
    return action;
  };
  const subscribe = (callback) => {
    subscriptions.push(callback);
    return () => {
      subscriptions.splice(subscriptions.indexOf(callback), 1);
    };
  };
  return {
    getState: () => state,
    dispatch,
    subscribe,
  };
}

const Context = createContext()
export function ResourceProvider({ urlBase, store, interval, children }) {
  const api = useAPI();

  useEffect(() => flushBatchesAtInterval(api, urlBase, store, interval), [api, urlBase, store, interval]);
  return <Context.Provider value={store}>{children}</Context.Provider>
}

export function useResources(resource, key, value, childResource) {
  const store = useContext(Context)
  const [state, setState] =
}