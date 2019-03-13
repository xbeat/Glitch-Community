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
};

/**
 * Heading Component
 */
const Heading = ({ children, tagName }) => {
  // In the future we might want tag names and sizes to be different

  // For now, we're keeping them 1-1,
  // and also specifically setting 'xlarge' and 'large' headings to be bold
  // which should match the current styles on production for switching to this

  const size = TAGS_AND_SIZES[tagName];
  const bold = tagName === 'xlarge' || tagName === 'large';
  const className = cx({
    [size]: true,
    bold,
  });
  return <tagName className={className}>{children}</tagName>;
};

Heading.propTypes = {
  /** element(s) to display in the button */
  children: PropTypes.node.isRequired,
  /** heading tag to be rendered [h1, h2...] */
  tagName: PropTypes.oneOf(TAGS_AND_SIZES.keys()).isRequired,
};

export default Heading;
