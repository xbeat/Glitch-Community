import React from 'react';
import PropTypes from 'prop-types';
import styles from './heading.styl';

/**
 * Heading Component
 */
const Heading = ({ children, tagName: TagName }) => <TagName>{children}</TagName>;

Heading.propTypes = {
  /** element(s) to display in the button */
  children: PropTypes.node.isRequired,
  /** heading tag to be rendered [h1, h2...] */
  tagName: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4']).isRequired,
};

export default Heading;
