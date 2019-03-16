import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../components/buttons/button';

const PopoverButton = ({ onClick, text, emoji }) => (
  <Button type="tertiary" size="small" onClick={onClick}>
    <span>{text} </span>
    <span className={`emoji ${emoji}`} />
  </Button>
);

PopoverButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.node.isRequired,
  emoji: PropTypes.string.isRequired,
};

export default PopoverButton;
