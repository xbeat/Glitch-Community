// transitional utilities that are redux-compatible without literally bringing in redux
import { useReducer } from 'react';
import { mapKeys, mapValues } from 'lodash';

export function useReducerWithMiddleware(reducer, init, ...middleware) {
  const [state, baseDispatch] = useReducer(reducer, undefined, init);
  let proxiedDispatch = null;
  const store = { getState: () => state, dispatch: (action) => proxiedDispatch(action) };
  proxiedDispatch = middleware.reduceRight((next, m) => m(store)(next), baseDispatch);
  return [state, store.dispatch];
}

// from redux
export const bindActionCreators = (actionCreators, dispatch) =>
  mapValues(actionCreators, (actionCreator) => (payload) => dispatch(actionCreator(payload)));

// from 'redux-starter-kit'
function createReducer(reducers) {
  return (state, action) => {
    if (reducers[action.type]) {
      return reducers[action.type](state, action);
    }
    return state;
  };
}

function createAction(type) {
  const actionCreator = (payload) => ({ type, payload });
  actionCreator.toString = () => type;
  return actionCreator;
}

export function createSlice({ slice, initialState, reducers }) {
  const mappedReducers = slice ? mapKeys(reducers, (_, actionType) => `${slice}/${actionType}`) : reducers;
  const reducer = createReducer(mappedReducers);
  const actions = mapValues(reducers, (value, actionType) => {
    const type = slice ? `${slice}/${actionType}` : actionType;
    return createAction(type);
  });
}

// from redux-aop (helpers for making middleware)

export function before(matcher, middleware) {
  return (next) => (store) => (action) => {
    if (!matcher(action)) {
      return next(action);
    }
    const result = middleware(store, action);
    if (result) {
      next(result);
    }
  };
}

export function after(matcher, middleware) {
  return (next) => (store) => (action) => {
    if (!matcher(action)) {
      return action;
    }
    const result = next(action);
    if (result) {
      return middleware(store, result);
    }
  };
}

export const always = () => true
export const matchTypes = (...actionsOrTypes) => {
  // coerce to strings, to use with redux-starter-kit action creators
  const types = actionsOrTypes.map(String)
  return (action) => types.includes(action)
}