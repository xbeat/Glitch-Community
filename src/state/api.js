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
  const [state, setState] = useState(initState)
  const version = useRef(1);
  const 
}



export const createAPIHook = (asyncFunction) => (...args) => {
  const api = useAPI();
  const [result, setResult] = useState({ state: 'loading' });
  
  const version = useRef(1);
  useEffect(() => {
    const thisVersion = version.current;
    setResult({ state: 'loading' });
    asyncFunction(api, ...args).then((value) => {
      if (version.current === thisVersion) {
        setResult({ state: 'ready', value });
      }
    });
    return () => {
      version.current++;
    };
  }, args);
  return result;
};
