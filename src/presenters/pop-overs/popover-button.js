import React from 'react';
import PropTypes from 'prop-types';

const PopoverButton = ({ onClick, text, emoji }) => (
  <button className="button-small has-emoji button-tertiary" onClick={onClick}>
    <span>{text} </span>
    <span className={`emoji ${emoji}`} />
  </button>
);

PopoverButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  /** text to display in the button */
  text: PropTypes.node.isRequired,
  /** emoji to display in the button */
  emoji: PropTypes.string.isRequired,
};

export default PopoverButton;
