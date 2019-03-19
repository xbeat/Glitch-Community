import React from 'react';
import PropTypes from 'prop-types';
import { loadAllCollections } from './featured-collections';
import { DataLoader } from './includes/loader';

class MoreCollections extends React.Component {
  constructor(props) {lo
    super(props);
    this.state = {};
  }

  render() {
    const { api, currentUser } = this.props;
    const collectionsToLoad = currentUser.collections.map((c) => ({ owner: currentUser.login, name: c.url }));
    
    return (
      <DataLoader get={() => loadAllCollections(api, collectionsToLoad)}>
        {(collections) => collections.filter((c) => !!c).map((collection) => {
          return <div>{JSON.stringify(collection)}</div>
        })}
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
