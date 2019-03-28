import { groupBy, partition } from 'lodash';
import produce from 'immer';
import { getAllPages } from '../../shared/api';

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
  if (!parent) return [{ value: request.value, index: getAPIPath(request) }];

  const { secondaryKeys = [] } = db.schema[request.resource];
  const keys = ['id', ...secondaryKeys];
  return keys.map((key) => ({ value: parent[key], index: getAPIPath({ ...request, key }) }));
};

const getChildren = (db, request) => {
  const indices = getIndices(db, request);
  return indices.find(({ value, index }) => db.index[index][value]);
};

// request = { resource, key, value, children? }
// maps to url `/:resource/by/:key/:children`

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
    return data.result(childIDsResult.value.map((id) => childTable.data[id]));
  }

  const result = getSingleItem(db, request);
  if (!result) return null;
  return data.result(result);
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

function insertLoadingStatusIntoDB(db, request) {
  if (request.children) {
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

const actions = {
  requestQueued: (payload) => ({ type: 'requestQueued', payload }),
  responseQueued: (payload) => ({ type: 'responseQueued', payload }),
  batchesFlushed: () => ({ type: 'batchesFlushed' })
}

const reducer = (state, action) => {
  switch (action.type) {
    // if a request cannot be fulfilled immediately, it is added to the requests batch.
    case 'requestQueued':
      return produce(state, (draft) => {
        draft.requests.push(action.payload);
      });
    // responses are also batched.
    case 'responseQueued':
      return produce(state, (draft) => {
        draft.responses.push(action.payload);
      });
    // every second the batches are flushed:
    // requests are fetched from the API, and responses are written to the DB.
    case 'batchesFlushed':
      return produce(state, (draft) => {
        draft.requests = [];
        draft.responses = [];
        state.requests.forEach((request) => insertLoadingStatusIntoDB(draft.db, request));
        state.responses.forEach((response) => insertResponseIntoDB(draft.db, response));
      });
    default:
      return state;
  }
};

function flushBatchesAtInterval (interval) {
  return ({ dispatch }) => {
    setInterval(() => {
      dispatch(actions.batchesFlushed);
    }, interval)
  }
}

function query (api, store, request) {
  const maybeResult = 
}

function createResourceManager({ schema, urlBase }) {
  const state = {
    db: createDB(schema),
    requests: [],
    responses: [],
    urlBase,
  };
}
