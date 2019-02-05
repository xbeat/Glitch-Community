import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './button.styl';

let cx = classNames.bind(styles);

export const TYPES = ["tertiary", "cta", "dangerZone"];
export const SIZES = ["small"];

/**
 * Button Component
 */
const Button = ({ onClick, disabled, type, size, hover, children, dataTrack }) => {
  let className = cx({
    btn: true,
    cta: type === "cta",
    small: size === "small",
    tertiary: ["tertiary", "dangerZone"].includes(type),
    dangerZone: type === "dangerZone",
    hover: hover,
  });
  
  return (
    <button onClick={onClick} className={className} data-track={dataTrack} disabled={disabled}>
      {children}
    </button>
  );
};

Button.propTypes = {
  /** callback when button clicked */
  onClick: PropTypes.func,
  /** button disabled */
  disabled: PropTypes.bool,
  /** type of button */
  type: PropTypes.oneOf(TYPES),
  /** size of button */
  size: PropTypes.string,
  /** tracking information */
  dataTrack: PropTypes.string,
};

export default Button;