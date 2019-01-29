import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind';
import styles from './button-with-emoji.css'
import { Button, TYPES, SIZES } from '../../atoms/button/button'
console.log(process.env.MOLECULE_DIR)

let cx = classNames.bind(styles);

/**
 * Button Component
 */
const ButtonWithEmoji = ({ onClick, disabled, type, size, emoji, children }) => {
  let className = cx({
    cta: type === "cta",
    small: size === "small",
    tertiary: type === "tertiary",
  });
  
  return (
    <div className={className}>
      <Button onClick={onClick} type size>
        {children}
      </Button>
    </div>
  )
}

ButtonWithEmoji.defaultProps = {
  type: "REGULAR",
  size: "REGULAR",
  emoji: "none"
};

ButtonWithEmoji.propTypes = {
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

export default ButtonWithEmoji