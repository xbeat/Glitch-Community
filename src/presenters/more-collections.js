import React from 'react';
import PropTypes from 'prop-types';
import { loadAllCollections } from './featured-collections';
import { DataLoader } from './includes/loader';
import { CoverContainer } from './includes/profile';
import { UserLink, TeamLink } from './includes/link';
import { getProfileStyle, getDisplayName } from '../models/user';

// move to components
//I wonder if this needs a new name or should be combined with the existing collectionItem in some way
const CollectionItem = ({ name, description, projects }) => {
  // should this whole thing be a button, an anchor tag, or a div? end result is to make it all clickable
  return (
    <div>
      <button>{name}</button>
      <div>{description}</div>
      <div>projectslength:{projects.length}</div>
    </div>
  );
}


class MoreCollections extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { api, currentUser, collection } = this.props;
    const collectionsToLoad = currentUser.collections.map((c) => ({ owner: currentUser.login, name: c.url }));
    const coverStyle = getProfileStyle({ ...currentUser, cache: currentUser._cacheCover })
    const isUserCollection = collection.teamId === -1;
    return (
      <div>
        <h2>
          {  
            isUserCollection ? 
              (<UserLink user={collection.user}>More from {getDisplayName(collection.user)} →</UserLink>) :
              (<TeamLink team={collection.team}>More from {collection.team.name} →</TeamLink>)
          }
        </h2>
        <DataLoader get={() => loadAllCollections(api, collectionsToLoad)}>
        {(collections) => {
          return (
            <CoverContainer style={coverStyle} className="collections">
              <>
                {
                  collections.map(c => <CollectionItem key={c.id} { ...c } />)
                }
              </>
            </CoverContainer>
          )
        }}
      </DataLoader>
      </div>
      
    );
  }
}

MoreCollections.propTypes = {
  collection: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  api: PropTypes.func.isRequired,
};

export default MoreCollections;
