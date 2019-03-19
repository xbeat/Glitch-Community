import React from 'react';
import PropTypes from 'prop-types';
import { loadAllCollections } from './featured-collections';
import { DataLoader } from './includes/loader';
import { CoverContainer } from './includes/profile';
import { UserLink } from './includes/link';
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
    const { api, currentUser } = this.props;
    const collectionsToLoad = currentUser.collections.map((c) => ({ owner: currentUser.login, name: c.url }));
    const coverStyle = getProfileStyle({ ...currentUser, cache: currentUser._cacheCover })
    // is there a way to know if a collection was created by a user vs a team ? 
    return (
      <div>
        <h2>
          <UserLink user={currentUser}>More by {getDisplayName(currentUser)} →</UserLink>
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
