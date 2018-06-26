import React from 'react';
import PropTypes from 'prop-types';

export default class Uploader extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return this.props.children;
  }
}

Uploader.propTypes = {
  children: PropTypes.func.isRequired,
};