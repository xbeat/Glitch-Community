import React from 'react';
import PropTypes from 'prop-types';


class MoreCollections extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { api, collection, currentUser } = this.props;
    console.log({ api, collection, currentUser });
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
