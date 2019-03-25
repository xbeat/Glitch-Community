import React, { createContext, useState, useEffect, useContext } from 'react';
import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';
import { mapValues, fromPairs, flatMap } from 'lodash';

// react-redux bindings (TODO: use react-redux when these are supported natively)

const ReduxContext = createContext();

export const Provider = ({ store, children }) => <ReduxContext.Provider value={store}>{children}</ReduxContext.Provider>;

export const useStore = () => useContext(ReduxContext);

export const useSelector = (selector, ...args) => {
  const store = useStore();
  const [state, setState] = useState(selector(store.getState(), ...args));
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const nextState = selector(store.getState(), ...args);
      setState(nextState);
    });
    return unsubscribe;
  }, [store, selector, ...args]);
  return state;
};

const bindActionCreators = (actions, dispatch) => mapValues(actions, (actionCreator) => (payload) => dispatch(actionCreator(payload)));

export const useActions = (actions) => {
  const store = useStore();
  return bindActionCreators(actions, store.dispatch);
};

// combine slices into a redux store

export function createStoreFromSlices(slices) {
  const reducer = fromPairs(slices.map((slice) => [slice.slice, slice.reducer]));
  const middleware = [...getDefaultMiddleware(), ...flatMap(slices, (slice) => slice.middleware)];
  return configureStore({
    reducer,
    middleware,
    devTools: true,
  });
}

// helpers for making middleware, after redux-aop

export function once(middleware) {
  return (store) => {
    middleware(store);
    return (next) => (action) => next(action);
  };
}

// run _before_ the reducer gets the action.
// useful for middleware that transform actions (e.g. running Promises).
export function before(matcher, middleware) {
  return (store) => (next) => (action) => {
    if (!matcher(action)) {
      return next(action);
    }
    const result = middleware(store, action);
    if (result) {
      return next(result);
    }
    return undefined;
  };
}

// run _after_ the reducer gets the action.
// useful for middleware that perform side effects (logging, dispatching other actions)
export function after(matcher, middleware) {
  return (store) => (next) => (action) => {
    const prevState = store.getState();
    const result = next(action);

    if (matcher(action)) {
      middleware(store, action, prevState);
    }

    return result;
  };
}

export const matchAlways = () => true;
export const matchTypes = (...actionsOrTypes) => {
  // coerce to strings, to use with redux-starter-kit action creators
  const types = actionsOrTypes.map(String);
  return (action) => action && types.includes(action.type);
};

let didFire = false;
export const matchOnce = () => {
  if (didFire) {
    return false;
  }
  didFire = true;
  return true;
};
