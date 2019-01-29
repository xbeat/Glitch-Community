import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind';
import styles from './button-with-emoji.css'
import Button, { TYPES, SIZES } from '../../atoms/button/button'
console.log(process.env.MOLECULE_DIR)

let cx = classNames.bind(styles);

/**
 * Button Component
 */
const ButtonWithEmoji = ({ onClick, disabled, type, size, emoji, children }) => {
  return (
    <div className="button-with-emoji">
      <Button onClick={onClick} type {size}>
        {children}
        <span className="emoji" role="presentation" style={{ backgroundImage: emoji }}></span>
      </Button>
    </div>
  )
}

ButtonWithEmoji.propTypes = {
  /** callback when button clicked */
  onClick: PropTypes.func,
  /** button disabled */
  disabled: PropTypes.bool,
  /** type of button */
  type: PropTypes.oneOf(TYPES),
  /** size of button */
  size: PropTypes.string,
  /** full url for emoji image */
  emoji: PropTypes.string.isRequired
};

export default ButtonWithEmoji