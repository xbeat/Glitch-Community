import React from 'react';
import PropTypes from 'prop-types';
import { sampleSize } from 'lodash';

import { getSingleItem } from '../../shared/api';

import { getProfileStyle as getUserStyle, getDisplayName } from '../models/user';
import { getProfileStyle as getTeamStyle } from '../models/team';

import { DataLoader } from './includes/loader';
import { CoverContainer } from './includes/profile';
import { UserLink, TeamLink } from './includes/link';

import CollectionItem from './collection-item';

const loadMoreCollectionsFromAuthor = async ({ api, collection }) => {
  const authorType = collection.teamId === -1 ? 'user' : 'team';
  const authorId = authorType === 'user' ? collection.userId : collection.teamId;

  let moreCollections;

  // get all collections from the author
  moreCollections = await getSingleItem(api, `v1/${authorType}s/${authorId}/collections?limit=10&orderKey=createdAt&orderDirection=DSC`, 'items');

  // filter out the current collection
  moreCollections = moreCollections.filter((c) => c.id !== collection.id);

  // get project details for each collection
  moreCollections = await Promise.all(moreCollections.map(async (c) => {
    c.projects = await getSingleItem(api, `/v1/collections/by/id/projects?id=${c.id}`, 'items');
    return c;
  }));

  // filter out collections that don't have projects
  moreCollections = moreCollections.filter((c) => c.projects && c.projects.length > 0);

  // pick 3 collections
  moreCollections = sampleSize(moreCollections, 3);

  // get author details and attach to each collection
  const authorDetails = await getSingleItem(api, `v1/${authorType}s/by/id/?id=${authorId}`, authorId);
  moreCollections = moreCollections.map((c) => {
    c[authorType] = authorDetails;
    return c;
  });

  return moreCollections;
};


// TODO: componentize this (CoverContainer, Links, CollectionItem, More Collections itself?)
const MoreCollections = ({ currentCollection, collections }) => {
  const isUserCollection = currentCollection.teamId === -1;
  const coverStyle = isUserCollection
    ? getUserStyle({ ...currentCollection.user })
    : getTeamStyle({ ...currentCollection.team });

  return (
    <section>
      <h2>
        {
          isUserCollection
            ? (<UserLink user={currentCollection.user}>More by {getDisplayName(currentCollection.user)} →</UserLink>)
            : (<TeamLink team={currentCollection.team}>More from {currentCollection.team.name} →</TeamLink>)
        }
      </h2>
      <CoverContainer style={coverStyle} className="collections more-collections">
        {
          collections.map((collection) => (
            <CollectionItem
              key={collection.id}
              collection={collection}
              showCurator={false}
              showProjectPreview={false}
              showCollectionAvatar={false}
            />
          ))
        }
      </CoverContainer>
    </section>
  );
};

MoreCollections.propTypes = {
  currentCollection: PropTypes.object.isRequired,
  collections: PropTypes.array.isRequired,
};

const MoreCollectionsContainer = ({ api, collection }) => (
  <DataLoader get={() => loadMoreCollectionsFromAuthor({ api, collection })}>
    {
      (collections) => collections.length > 0
        ? <MoreCollections currentCollection={collection} collections={collections} />
        : null
    }
  </DataLoader>
);


MoreCollectionsContainer.propTypes = {
  collection: PropTypes.object.isRequired,
  api: PropTypes.func.isRequired,
};

export default MoreCollectionsContainer;
