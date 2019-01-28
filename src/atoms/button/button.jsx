import React from 'react'
import PropTypes from 'prop-types'
import './button.css'

const TYPES = ["TERTIARY", "CTA", "REGULAR"]
const SIZES = ["SMALL", "REGULAR"]

Button.defaultProps({
  type: "REGULAR",
  size: "REGULAR",
  emoji: "none"
});

/**
 * Button Component
 */
const Button = ({ onClick, disabled, type, size, emoji }) => {
  return (
    <button onClick={onClick} disabled={disabled} type={type} size={size} emoji={emoji} />
  )
}

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