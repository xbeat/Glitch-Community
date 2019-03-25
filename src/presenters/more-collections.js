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


// TODO: componentize this (CoverContainer, Links, CollectionItem, More Collections itself?)
const MoreCollections = ({ currentCollection, collections, currentUser }) => {
  const isUserCollection = currentCollection.teamId === -1;
  const coverStyle = isUserCollection
    ? getUserStyle({ ...currentUser, cache: currentUser._cacheCover }) // eslint-disable-line no-underscore-dangle
    : getTeamStyle({ ...currentCollection.team, cache: currentCollection.team._cacheCover }); // eslint-disable-line no-underscore-dangle

  return (
    <section>
      <h2>
        {
          isUserCollection
            ? (<UserLink user={currentCollection.user}>More by {getDisplayName(currentCollection.user)} →</UserLink>)
            : (<TeamLink team={currentCollection.team}>More from {currentCollection.team.name} →</TeamLink>)
        }
      </h2>
      <CoverContainer style={coverStyle} className="collections">
        <div className="more-collections">
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
        </div>
      </CoverContainer>
    </section>
  );
};

MoreCollections.propTypes = {
  currentCollection: PropTypes.object.isRequired,
  collections: PropTypes.array.isRequired,
  currentUser: PropTypes.object.isRequired,
};

const MoreCollectionsContainer = ({ api, currentUser, collection }) => (
  <DataLoader get={() => loadMoreCollectionsFromAuthor({ api, collection })}>
    {
      (collections) => collections.length > 0
        ? <MoreCollections currentCollection={collection} currentUser={currentUser} collections={collections} />
        : null
    }
  </DataLoader>
);


MoreCollectionsContainer.propTypes = {
  collection: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  api: PropTypes.func.isRequired,
};

export default MoreCollectionsContainer;
