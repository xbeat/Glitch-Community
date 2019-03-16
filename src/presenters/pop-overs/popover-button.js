import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../components/buttons/button';

const PopoverButton = ({ onClick, text, emoji, link }) => (
  <Button type="tertiary" size="small" onClick={onClick} link={link}>
    <span>{text} </span>
    <span className={`emoji ${emoji}`} />
  </Button>
);

PopoverButton.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.node.isRequired,
  emoji: PropTypes.string.isRequired,
  link: PropTypes.string,
};

PopoverButton.defaultPropTypes = {
  onClick: null,
  link: null,
};

export default PopoverButton;
