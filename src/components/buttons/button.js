import React from 'react';
import PropTypes from 'prop-types';
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

  return (
    <button onClick={onClick} className={className} disabled={disabled}>
      {children}
    </button>
  );
};

Button.propTypes = {
  /** element(s) to display in the button */
  children: PropTypes.node.isRequired,
  /** callback when button clicked */
  onClick: function(props, propName, componentName) {
      if ((props['link'] == false && (props[propName] == undefined || typeof(props[propName]) != 'function'))) {
        return new Error(
            'Please provide an onClick function';
        );
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
};

Button.defaultProps = {
  onClick: () => {},
  disabled: false,
  type: null,
  size: null,
  hover: false,
  link: null,
};

export default Button;
