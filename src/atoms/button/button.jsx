import React from 'react'
import PropTypes from 'prop-types'

/**
 * Button Component
 */
const Button = ({ onClick, tertiary, style, children }) => {
  return (
    <button onClick={onClick} tertiary={tertiary} style={style}>
      {children}
    </button>
  )
}

Button.propTypes = {
  /** callback when button clicked */
  onClick: PropTypes.func,
  /** button disabled */
  disabled: PropTypes.bool,
  /** type of button */
  type: PropTypes.text,
  /** */
  size: PropTypes.text,
  
}

export default Button