import React from 'react';
import PropTypes from 'prop-types';

import { loadAllCollections } from './featured-collections'; // maybe we should move this elsewhere

import { getProfileStyle, getDisplayName } from '../models/user';
import { getLink } from '../models/collection';

import { DataLoader } from './includes/loader';
import { CoverContainer } from './includes/profile';
import { UserLink, TeamLink } from './includes/link';

import Text from '../components/text/text';

const CollectionItem = ({ name, description, projects, coverColor, user, url }) => {
  const projectsCount = `${projects.length} project${projects.length > 1 ? 's' : ''}`;
  return (
    <a href={getLink({ user, url })} className="more-collections-item" style={{ backgroundColor: coverColor }}>
      <button>{name}</button>
      <Text>{description}</Text>
      {projects.length > 0 && <div className="projects-count">{projectsCount}</div>}
    </a>
  );
};


class MoreCollections extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { api, currentUser, collection } = this.props;
    const collectionsToLoad = currentUser.collections.map((c) => ({ owner: currentUser.login, name: c.url }));
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
        <DataLoader get={() => loadAllCollections(api, collectionsToLoad)}>
          {
            (collections) => (
              <CoverContainer style={coverStyle} className="collections">
                <div className="more-collections">
                  {collections.filter((c) => c.id !== collection.id).map((c) => <CollectionItem key={c.id} {...c} />)}
                </div>
              </CoverContainer>
            )
          }
        </DataLoader>
      </section>
    );
  }
}

MoreCollections.propTypes = {
  collection: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  api: PropTypes.func.isRequired,
};

export default MoreCollections;
