import React from 'react';
import PropTypes from 'prop-types';

const cat = "https://cdn.glitch.com/us-east-1%3Acba180f4-ee65-4dfc-8dd5-f143280d3c10%2Fcat.svg";

const NotFound = ({name}) => (
  <section>
    <p>we didn't find {name}</p>
    <img src={cat} alt="" />
  </section>
);

NotFound.propTypes = {
  name: PropTypes.string.isRequired,
};

export default NotFound;
