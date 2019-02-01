import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind';
import styles from './button.css';

let cx = classNames.bind(styles);

export const TYPES = ["tertiary", "cta"];
export const SIZES = ["small"];

/**
 * Button Component
 */
const Button = ({ onClick, disabled, type, size, hover, children, dataTrack }) => {
  let className = cx({
    cta: type === "cta",
    small: size === "small",
    tertiary: type === "tertiary",
    hover: hover,
  });
  
  return (
    <button onClick={onClick} className={className} data-track={dataTrack}>
      {children}
    </button>
  );
}

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

export default Button