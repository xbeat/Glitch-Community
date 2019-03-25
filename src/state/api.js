/* globals API_URL */
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { memoize } from 'lodash';
import { useCurrentUser } from './current-user';

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
function useAsyncEffectState(initState, handler, args) {
  const [state, setState] = useState(initState);
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
  }, args);
  return state;
}

export const createAPIHook = (asyncFunction) => (...args) => {
  const api = useAPI();
  const loading = { state: 'loading' };
  const result = useAsyncEffectState(
    loading,
    (setResult, version) => {
      // reset to 'loading' if the args change
      if (version > 0) {
        setResult(loading);
      }
      asyncFunction(api, ...args).then((value) => {
        setResult({ state: 'ready', value });
      });
    },
    args,
  );
  return result;
};
