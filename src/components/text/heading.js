import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './heading.styl';

const cx = classNames.bind(styles);

const TAGS_AND_SIZES = {
  h1: 'xlarge',
  h2: 'large',
  h3: 'medium',
  h4: 'small',
}

/**
 * Heading Component
 */
const Heading = ({ children, tagName}) => {
  const className = cx({
    [TAGS_AND_SIZES[tagName]]: true,
    bold: tagName === 'xlarge' || tagName === 'large'
  });
  const HeadingTag = tagName
  return <HeadingTag className={className}>{children}</HeadingTag>;
};

Heading.propTypes = {
  /** element(s) to display in the button */
  children: PropTypes.node.isRequired,
  /** heading tag to be rendered [h1, h2...] */
  tagName: PropTypes.oneOf(TAGS_AND_SIZES.keys()).isRequired,
};

export default Heading;
