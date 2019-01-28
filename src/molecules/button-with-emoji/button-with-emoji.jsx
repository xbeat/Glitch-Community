import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind';
import styles from './button.css'

let cx = classNames.bind(styles);

const TYPES = ["tertiary", "cta"]
const SIZES = ["small"]

/**
 * Button Component
 */
const Button = ({ onClick, disabled, type, size, emoji, children }) => {
  let className = cx({
    cta: type === "cta",
    small: size === "small",
    tertiary: type === "tertiary",
  });
  
  return (
    <button onClick={onClick} disabled={disabled} emoji={emoji} children={children} className={className}>
      {children}
    </button>
  )
}

Button.defaultProps = {
  type: "REGULAR",
  size: "REGULAR",
  emoji: "none"
};

Button.propTypes = {
  /** callback when button clicked */
  onClick: PropTypes.func,
  /** button disabled */
  disabled: PropTypes.bool,
  /** type of button */
  type: PropTypes.oneOf(TYPES),
  /** size of button */
  size: PropTypes.text,
  emoji: PropTypes.text
};

export default Button