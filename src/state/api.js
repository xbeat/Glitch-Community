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



function useVersionedState (initState) {
  return {
    state,
    getVersion: () => versionRef.current,
    bumpVersion: ()=> { versionRef.current++; },
    setStateForVersion: (nextState, version) => {
      if (version === versionRef.current) {
        setState(nextState)
      }
    }
  }
}

function useAsyncEffectState (initState, handler, args) {
  const [state, setState] = useState(initState)
  const versionRef = useRef(1);
  useEffect(() => {
    const version = versionRef.current;
    const setState
    
    handler(setStateForVersion)
    return () => { versionRef.current++; }
  }, args)
  return state.state;
} 



export const createAPIHook = (asyncFunction) => (...args) => {
  const api = useAPI();
  const { state, getVersion, bumpVersion, setStateForVersion } = useVersionedState({ state: 'loading' });
  useEffect(() => {
    const version = versionedState.getVersion();
    versionedState({ state: 'loading' });
    asyncFunction(api, ...args).then((value) => {
      if (version.current === thisVersion) {
        setResult({ state: 'ready', value });
      }
    });
    return 
  }, args);
  return result;
};
