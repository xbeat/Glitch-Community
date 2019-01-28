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
  /** custom button style */
  style: PropTypes.object,
  /** children nodes  */
  children: PropTypes.node
}

export default Button