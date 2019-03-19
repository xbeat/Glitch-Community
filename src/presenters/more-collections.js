import React from 'react';
import PropTypes from 'prop-types';
import { loadAllCollections } from './presenters/featured-collections';

class MoreCollections extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const { api, collection, currentUser } = this.props;
    console.log({ api, collection, currentUser });
    currentUser.collections.map(c => 
    loadAllCollections(api, { })
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
