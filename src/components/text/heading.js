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
const Heading = ({ children, tagName, className }) => {
  // In the future we might want tag names and sizes to be different

  // For now, we're keeping them 1-1,
  // and also specifically setting 'h1' and 'h2' headings to be bold
  // which should match the current styles on production for switching to this

  const size = TAGS_AND_SIZES[tagName];
  const bold = tagName === 'h1' || tagName === 'h2';
  const classNames = cx({
    [size]: true,
    bold,
    [className]: className !== undefined,
  });

  return <tagName className={className}>{children}</tagName>;
};

Heading.propTypes = {
  /** element(s) to display in the button */
  children: PropTypes.node.isRequired,
  /** heading tag to be rendered [h1, h2...] */
  tagName: PropTypes.oneOf(Object.keys(TAGS_AND_SIZES)).isRequired,
  /** additional className to add to the heading */
  className: PropTypes.string,
};

Heading.defaultProps = {
  className: undefined,
};

export default Heading;
