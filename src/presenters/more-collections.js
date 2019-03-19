import React from 'react';
import PropTypes from 'prop-types';
import { loadAllCollections } from './featured-collections';

class MoreCollections extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const { api, collection, currentUser } = this.props;
    console.log({ api, collection, currentUser });
    const collectionsToLoad = currentUser.collections.map((c) => ({ owner: currentUser.login, name: c.url }));
    const loadedCollections = await loadAllCollections(api, collectionsToLoad);
    console.log('wat', loadedCollections);
  }

  render() {
    return (
      <div>More collections coming soon</div>
    );
  }
}

MoreCollections.propTypes = {
  collection: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  api: PropTypes.func.isRequired,
};

export default MoreCollections;
