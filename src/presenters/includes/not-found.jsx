import React from 'react';
import PropTypes from 'prop-types';

const NotFound = ({name}) => (
  <section>
    <p>we didn't find {name}</p>
  </section>
);

NotFound.propTypes = {
  name: PropTypes.string.isRequired,
};

export default NotFound;
