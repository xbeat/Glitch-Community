import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './button.styl';

const cx = classNames.bind(styles);

export const TYPES = ['default'];
export const SIZES = ['small', 'regular'];

/**
 * Text Component
 */
const Text = ({ type, size, children }) => {
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

Text.propTypes = {
  /** element(s) to display in the button */
  children: PropTypes.node.isRequired,
  /** type of button */
  type: PropTypes.oneOf(TYPES),
  /** size of button */
  size: PropTypes.oneOf(SIZES),
};

Text.defaultProps = {
  type: '',
  size: '',
};

export default Text;
