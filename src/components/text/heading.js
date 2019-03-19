import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './heading.styl';

const cx = classNames.bind(styles);

export const TAGS = ['h1', 'h2', 'h3', 'h4'];

/**
 * Heading Component
 */
const Heading = ({ children, tagName: TagName }) => {
  const classNameObj = {
    heading: true,
  };
  classNameObj[TagName] = true;
  
  return <TagName className={cx(classNameObj)}>{children}</TagName>;
};

Heading.propTypes = {
  /** element(s) to display in the button */
  children: PropTypes.node.isRequired,
  /** heading tag to be rendered */
  tagName: PropTypes.oneOf(TAGS).isRequired,
};

export default Heading;
