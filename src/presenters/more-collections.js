import React from 'react';
import PropTypes from 'prop-types';
import { sampleSize } from 'lodash';

import { getSingleItem } from '../../shared/api';
import { getProfileStyle, getDisplayName } from '../models/user';
import { getLink } from '../models/collection';

import { DataLoader } from './includes/loader';
import { CoverContainer } from './includes/profile';
import { UserLink, TeamLink } from './includes/link';

import Text from '../components/text/text';
import Button from '../components/buttons/button';

// this should probably live outside this file
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

// could easily be moved to a /components file if we want? though I'm not sure we'll ever reuse it
const CollectionItem = ({ name, description, projects, coverColor, user, team, url }) => {
  const projectsCount = `${projects.length} project${projects.length === 1 ? '' : 's'}`;
  return (
    <a href={getLink({ user, team, url })} className="more-collections-item" style={{ backgroundColor: coverColor }}>
      <Button>{name}</Button>
      <Text>{description}</Text>
      <div className="projects-count">{projectsCount}</div>
    </a>
  );
};

// should this also be in /components? should we combine it with above into one react component?
// how do we feel about `DataLoader`?
const MoreCollections = ({ api, currentUser, collection }) => {
  const coverStyle = getProfileStyle({ ...currentUser, cache: currentUser._cacheCover }); // eslint-disable-line no-underscore-dangle
  const isUserCollection = collection.teamId === -1;

  return (
    <section>
      <h2>
        {
          isUserCollection
            ? (<UserLink user={collection.user}>More from {getDisplayName(collection.user)} →</UserLink>)
            : (<TeamLink team={collection.team}>More from {collection.team.name} →</TeamLink>)
        }
      </h2>
      <DataLoader get={() => loadMoreCollectionsFromAuthor({ api, collection })}>
        {
          (collections) => (
            <CoverContainer style={coverStyle} className="collections">
              <div className="more-collections">
                {collections.map((c) => <CollectionItem key={c.id} {...c} />)}
              </div>
            </CoverContainer>
          )
        }
      </DataLoader>
    </section>
  );
};

MoreCollections.propTypes = {
  collection: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  api: PropTypes.func.isRequired,
};

export default MoreCollections;
