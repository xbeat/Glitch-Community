import React from 'react';
import PropTypes from 'prop-types';
import { loadAllCollections } from './featured-collections';
import { DataLoader } from './includes/loader';
import { CoverContainer } from './includes/profile';
import { getProfileStyle } from '../models/user';

//I wonder if this needs a new name or should be combined with the existing collectionItem in some way
const CollectionItem = (collection) => {
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
    return (
      <DataLoader get={() => loadAllCollections(api, collectionsToLoad)}>
        {(collections) => {
          return (
            <CoverContainer style={coverStyle} className="collections">
              <>
                {
                  collections.map(c => {
                    return <div>{c.name}</div>
                  })
                }
              </>
            </CoverContainer>
          )
        }}
      </DataLoader>
    );
  }
}

MoreCollections.propTypes = {
  collection: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  api: PropTypes.func.isRequired,
};

export default MoreCollections;
