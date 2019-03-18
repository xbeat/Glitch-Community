import React from 'react';
import PropTypes from 'prop-types';
import Button from 'Components/buttons/button';

const PopoverButton = ({ onClick, text, emoji, href, disabled }) => (
  <Button type="tertiary" size="small" onClick={onClick} href={href} disabled={disabled}>
    <span>{text} </span>
    <span className={`emoji ${emoji}`} />
  </Button>
);

PopoverButton.propTypes = {
  /** text to display in the button */
  text: PropTypes.node.isRequired,
  /** emoji to display in the button */
  emoji: PropTypes.string.isRequired,
  /** onClick function activated when button is clicked */
  onClick(props, propName) {
    if (props.href === false && (props[propName] === null || typeof props[propName] !== 'function')) {
      return new Error('Please provide a href or an onClick function');
    }
    return null;
  },
  /** link followed when button is clicked */
  href(props, propName) {
    if (props.onClick === false && (props[propName] === null || typeof props[propName] !== 'string')) {
      return new Error('Please provide a href or an onClick function');
    }
    return null;
  },
  disabled: PropTypes.bool,
};

PopoverButton.defaultProps = {
  onClick: null,
  href: null,
  disabled: false,
};

export default PopoverButton;
