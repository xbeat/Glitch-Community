import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './heading.styl';

const cx = classNames.bind(styles);

export const TAG_NAMES = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
export const SIZES = ['small']; // I'm into sizes being different from tagNames after I took a nap, maybe?

/**
 * Heading Component
 */
const Heading = ({ children, length }) => {
  const className = cx({
    btn: true,
    cta: type === 'cta',
    small: size === 'small',
    tertiary: ['tertiary', 'dangerZone'].includes(type),
    dangerZone: type === 'dangerZone',
    hover,
  });
  return <TAG_NAMES className={className}> /;
};

Heading.propTypes = {
  /** element(s) to display in the button */
  children: PropTypes.node.isRequired,
  /** length to truncate rendered Heading to */
  length: PropTypes.number,
};

Heading.defaultProps = {
  length: -1,
};

export default Heading;
