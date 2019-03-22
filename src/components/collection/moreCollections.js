import React from 'react';
import PropTypes from 'prop-types';

import { getProfileStyle, getDisplayName } from '../models/user';
import { getLink } from '../models/collection';

import { CoverContainer } from './includes/profile';
import { UserLink, TeamLink } from './includes/link';

import Markdown from '../components/text/markdown';
import Button from '../components/buttons/button';

const MoreCollections = ({ currentCollection, collections, currentUser }) => {
  const coverStyle = getProfileStyle({ ...currentUser, cache: currentUser._cacheCover }); // eslint-disable-line no-underscore-dangle
  const isUserCollection = currentCollection.teamId === -1;

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
            collections.map(({ name, description, projects, coverColor, user, team, url, id }) => {
              const projectsCount = `${projects.length} project${projects.length === 1 ? '' : 's'}`;
              return (
                <a key={id} href={getLink({ user, team, url })} className="more-collections-item" style={{ backgroundColor: coverColor }}>
                  <Button>{name}</Button>
                  <Markdown>{description}</Markdown>
                  <div className="projects-count">{projectsCount}</div>
                </a>
              );
            })
          }
        </div>
      </CoverContainer>
    </section>
  );
};

MoreCollections.propTypes = {
  currentCollection: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  api: PropTypes.func.isRequired,
};

export default 