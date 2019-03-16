import React from 'react';
import PropTypes from 'prop-types';

import Link from '../../presenters/includes/link';

import classNames from 'classnames/bind';
import styles from './button.styl';

const cx = classNames.bind(styles);

export const TYPES = ['tertiary', 'cta', 'dangerZone'];
export const SIZES = ['small'];

/**
 * Button Component
 */

const Button = ({ onClick, link, disabled, type, size, hover, children }) => {
  const className = cx({
    btn: true,
    cta: type === 'cta',
    small: size === 'small',
    tertiary: ['tertiary', 'dangerZone'].includes(type),
    dangerZone: type === 'dangerZone',
    hover,
  });

  const linkOrButton = () => {
    if (onClick) {
      return (
        <button onClick={onClick} className={className} disabled={disabled}>
          {children}
        </button>
      );
    } else {
      return (
        <Link to={link} className={className}>
          {children}
        </Link>
      );
    }
  };

  return linkOrButton();
};

Button.propTypes = {
  /** element(s) to display in the button */
  children: PropTypes.node.isRequired,
  /** callback when button clicked */
  onClick: function(props, propName, componentName) {
    if (props['link'] == false && (props[propName] == undefined || typeof props[propName] != 'function')) {
      return new Error('Please provide a link or an onClick function');
    }
  },
  /** button disabled */
  disabled: PropTypes.bool,
  /** type of button */
  type: PropTypes.oneOf(TYPES),
  /** size of button */
  size: PropTypes.oneOf(SIZES),
  /** whether or not the button's hover state should be active */
  hover: PropTypes.bool,
  /** link when button clicked */
  link: function(props, propName, componentName) {
    if (props['onClick'] == false && (props[propName] == undefined || typeof props[propName] != 'string')) {
      return new Error('Please provide a link or an onClick function');
    }
  },
};

Button.defaultProps = {
  onClick: null,
  disabled: false,
  type: null,
  size: null,
  hover: false,
  link: null,
};

export default Button;
