import React from 'react';
import PropTypes from 'prop-types';

import { getProfileStyle as getUserStyle, getDisplayName } from '../../models/user';
import { getProfileStyle as getTeamStyle } from '../../models/team';
// import { getLink } from '../../models/collection';

import { CoverContainer } from '../../presenters/includes/profile';
import { UserLink, TeamLink } from '../../presenters/includes/link';
import CollectionItem from '../../presenters/collection-item';

// import Markdown from '../text/markdown';
// import Button from '../buttons/button';

// import styles from './more-collections.styl';
// TODO:
// - componentize CoverContainer
// - componentize UserLink and TeamLink (this is in-flight by Sheridan, probs will just be one generic link)
// bring in styles from here and delete styles/more-collections.styl


// <a key={id} href={getLink({ user, team, url })} className="more-collections-item" style={{ backgroundColor: coverColor }}>
//   <Button>{name}</Button>
//   <Markdown>{description}</Markdown>
//   <div className="projects-count">{projectsCount}</div>
// </a>
const MoreCollections = ({ currentCollection, collections, currentUser }) => {
  const isUserCollection = currentCollection.teamId === -1;
  const coverStyle = isUserCollection
    ? getUserStyle({ ...currentUser, cache: currentUser._cacheCover }) // eslint-disable-line no-underscore-dangle
    : getTeamStyle({ ...currentCollection.team });

  return (
    <section>
      <h2>
        {
          isUserCollection
            ? (<UserLink user={currentCollection.user}>More from {getDisplayName(currentCollection.user)} →</UserLink>)
            : (<TeamLink team={currentCollection.team}>More from {currentCollection.team.name} →</TeamLink>)
        }
      </h2>
      <CoverContainer style={coverStyle} className="collections">
        <div className="more-collections">
          {
            collections.map((collection) => (
              <CollectionItem showCurator={false} key={collection.id} collection={collection} showProjectPreview={false} />
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

export default MoreCollections;
