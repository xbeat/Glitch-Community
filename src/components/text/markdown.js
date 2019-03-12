import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './button.styl';

const cx = classNames.bind(styles);

export const TYPES = ['default'];
export const SIZES = ['small', 'regular'];

/**
 * Markdown Component
 */
const Markdown = ({ type, size, children }) => {
  const className = cx({
    spn: true,
    // cta: type === 'cta',
    // small: size === 'small',
    // tertiary: ['tertiary', 'dangerZone'].includes(type),
    // dangerZone: type === 'dangerZone',
  });

  return (
    <span className={className}>
      {children}
    </span>
  );
};

Markdown.propTypes = {
  /** element(s) to display in the button */
  children: PropTypes.node.isRequired,
  /** type of button */
  type: PropTypes.oneOf(TYPES),
  /** size of button */
  size: PropTypes.oneOf(SIZES),
};

Markdown.defaultProps = {
  type: '',
  size: '',
};

export default Markdown;
