import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './heading.styl';

const cx = classNames.bind(styles);

export const TAG_NAMES = ['h1', 'h2', 'h3', 'h4'];
export const SIZES = ['xlarge', 'large', 'medium', 'small']; // I'm into sizes being different from tagNames after I took a nap, maybe?

/**
 * Heading Component
 */
const Heading = ({ children, tagName, size, bold }) => {
  const className = cx({
    size,
    bold
  });
  const HeadingTag = TAG_NAMES[tagName];
  return <HeadingTag className={className}>{children}</HeadingTag>;
};

Heading.propTypes = {
  /** element(s) to display in the button */
  children: PropTypes.node.isRequired,
  /** heading tag to be rendered [h1, h2...] */
  tagName: PropTypes.oneOf(TAG_NAMES).isRequired,
  /** size of the heading [xlarge, large...] */
  size: PropTypes.oneOf(SIZES.keys()).isRequired,
  /** make the heading bold */
  bold: PropTypes.bool,
};

export default Heading;
