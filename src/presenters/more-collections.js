import React from 'react';
import PropTypes from 'prop-types';


class MoreCollections extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const { api, collection, currentUser } = this.props;
    console.log({ api, collection, currentUser });

    const collections = await api.get(`users/${currentUser.id}/collections`);
    console.log("collections", collections);
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
