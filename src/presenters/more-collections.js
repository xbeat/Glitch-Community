import React from 'react';
import PropTypes from 'prop-types';
import { sampleSize } from 'lodash';

import { getSingleItem } from '../../shared/api';

import { DataLoader } from './includes/loader';
import MoreCollections from '../components/collection/more-collections';

// where should this live?
const loadMoreCollectionsFromAuthor = async ({ api, collection }) => {
  const authorType = collection.teamId === -1 ? 'user' : 'team';
  const authorId = authorType === 'user' ? collection.userId : collection.teamId;

  let moreCollections;

  // get all collections from the author
  moreCollections = await getSingleItem(api, `v1/${authorType}s/${authorId}/collections`, 'items');

  // filter out the current collection
  moreCollections = moreCollections.filter((c) => c.id !== collection.id);

  // pick 3 collections
  moreCollections = sampleSize(moreCollections, 3);

  // get project details for each collection
  moreCollections = await Promise.all(moreCollections.map(async (c) => {
    c.projects = await getSingleItem(api, `/v1/collections/by/id/projects?id=${c.id}`, 'items');
    return c;
  }));

  // get author details and attach to each collection
  const authorDetails = await getSingleItem(api, `v1/${authorType}s/by/id/?id=${authorId}`, authorId);
  moreCollections = moreCollections.map((c) => {
    c[authorType] = authorDetails;
    return c;
  });

  return moreCollections;
};


// how do we feel about `DataLoader`?
const MoreCollectionsContainer = ({ api, currentUser, collection }) => (
  <DataLoader get={() => loadMoreCollectionsFromAuthor({ api, collection })}>
    {(collections) => collections.length > 0 ? <MoreCollections currentCollection={collection} currentUser={currentUser} collections={collections} /> : null}
  </DataLoader>
);


MoreCollectionsContainer.propTypes = {
  collection: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  api: PropTypes.func.isRequired,
};

export default MoreCollectionsContainer;
