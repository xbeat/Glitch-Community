/* globals API_URL */
import { useState, useEffect } from 'react';
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

export const useAsync = (asyncFunction, ...args) => {
  const api = useAPI();
  const [result, setResult] = useState(null);
  useEffect(() => {
    asyncFunction(api, ...args).then(setResult);
  }, args);
  return result;
};
