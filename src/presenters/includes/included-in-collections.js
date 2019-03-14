import React, { useEffect } from 'react';
import { getSingleItem, getAllPages, allByKeys } from '../../../shared/api';

const getIncludedCollections = async (api, projectId) => {
  
  const collections = await getAllPages(api,`/v1/projects/by/id/collections?id=${projectId}&limit=100&orderKey=createdAt&orderDirection=DESC`);
  const withProjectsAndUsers = await Promise.all(collections.map(async (collection) => {
    const { projects, users } = await allByKeys({
      // TODO: are we only getting 3 items here?
      projects: getAllPages(api,`/v1/projects/by/id/collections?id=${projectId}&limit=100&orderKey=createdAt&orderDirection=DESC`),
      users: getAll
    })
    return { ...collection, projects, users }
  }));
};

const IncludedInCollections = ({ api, projectId }) => {
  console.log('included');
  return (
    <>
      <h2>Included in Collections</h2>
    </>
  );
};

export default IncludedInCollections;
llections;
