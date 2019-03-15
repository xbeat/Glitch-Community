import React from 'react';
import PropTypes from 'prop-types';
import styles from './heading.styl';

export const TAGS = ['h1', 'h2', 'h3', 'h4'];

/**
 * Heading Component
 */
const Heading = ({ children, tagName: TagName }) => <TagName className={styles[TagName]}>{children}</TagName>;

Heading.propTypes = {
  /** element(s) to display in the heading */
  children: PropTypes.node.isRequired,
  /** heading tag to be rendered */
  tagName: PropTypes.oneOf(TAGS).isRequired,
};

export default Heading;
