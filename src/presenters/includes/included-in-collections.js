import React, { createRef, useState, useEffect } from 'react';
import { getSingleItem, getAllPages, allByKeys } from '../../../shared/api';

const getIncludedCollections = async (api, projectId) => {
  // TODO: are we only getting 3 collections here?
  const collections = await getAllPages(api, `/v1/projects/by/id/collections?id=${projectId}&limit=100&orderKey=createdAt&orderDirection=DESC`);
  return await Promise.all(
    collections.map(async (collection) => {
      const { projects, user } = await allByKeys({
        // TODO: are we only getting 3 projects here?
        projects: getAllPages(api, `/v1/collections/by/id/projects?id=${collection.id}&limit=100&orderKey=createdAt&orderDirection=DESC`),
        user: collection.user && getSingleItem(api, `v1/users/by/id?id=${collection.user.id}`, collection.user.id),
      });
      return { ...collection, projects, user };
    }),
  );
};

const useAPI = (cb, ...args) => {
  const [result, setResult] = useState(null)
  useEffect(() => {
    cb(...args).then(setResult);
  }, args);
  return result
};

const IncludedInCollections = ({ api, projectId }) => {
  const data = useAPI(getIncludedCollections, api, projectId);
  if (!data) {
    return null;
  }
  console.log(data);
  return (
    <>
      <h2>Included in Collections</h2>
    </>
  );
};

export default IncludedInCollections;
