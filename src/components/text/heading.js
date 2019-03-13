import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './heading.styl';

const cx = classNames.bind(styles);

export const TAG_NAMES = ['h1', 'h2', 'h3', 'h4'];
export const SIZES = {
  small: '',
  medium: '',
  large: '',
  xlarge: '',
}; // I'm into sizes being different from tagNames after I took a nap, maybe?

/**
 * Heading Component
 */
const Heading = ({ children, tagName }) => {
  const className = cx({
    heading: true,
  });
  const HeadingTag = TAG_NAMES[tagName];
  return <HeadingTag className={className}>{children}</HeadingTag>;
};

Heading.propTypes = {
  /** element(s) to display in the button */
  children: PropTypes.node.isRequired,
  /** length to truncate rendered Heading to */
  tagName: PropTypes.oneOf(TAG_NAMES).isRequired,
  size: PropTypes.oneOf(SIZES.keys()).isRequired,
};

export default Heading;
