import React, { useState, useEffect } from 'react';
import { getSingleItem, getAllPages, allByKeys } from '../../../shared/api';

import CollectionItem from '../collection-item';

const getIncludedCollections = async (api, projectId) => {
  const collections = await getAllPages(api, `/v1/projects/by/id/collections?id=${projectId}&limit=100&orderKey=createdAt&orderDirection=DESC`);
  return Promise.all(
    collections.map(async (collection) => {
      const { projects, user, team } = await allByKeys({
        projects: getAllPages(api, `/v1/collections/by/id/projects?id=${collection.id}&limit=100&orderKey=createdAt&orderDirection=DESC`),
        user: collection.user && getSingleItem(api, `v1/users/by/id?id=${collection.user.id}`, collection.user.id),
        team: collection.team && getSingleItem(api, `v1/teams/by/id?id=${collection.team.id}`, collection.team.id),
      });
      return { ...collection, projects, user, team };
    }),
  );
};

const useAsync = (cb, ...args) => {
  const [result, setResult] = useState(null);
  useEffect(() => {
    cb(...args).then(setResult);
  }, args);
  return result;
};

const IncludedInCollections = ({ api, projectId }) => {
  const collections = useAsync(getIncludedCollections, api, projectId);
  if (!collections) {
    return null;
  }
  return (
    <div className="collections">
      <h2>Included in Collections</h2>
      <ul className="collections-container">
        {collections.map((collection) => (
          <CollectionItem showUser key={collection.id} collection={collection} />
        ))}
      </ul>
    </div>
  );
};

export default IncludedInCollections;
