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
  onClick: function(props, propName, componentName) {
    if (props.link === false && (props[propName] === null || typeof props[propName] !== 'function')) {
      return new Error('Please provide a link or an onClick function');
    }
  },
  link: function(props, propName, componentName) {
    if (props.onClick === false && (props[propName] === null || typeof props[propName] !== 'string')) {
      return new Error('Please provide a link or an onClick function');
    }
  },
};

export default PopoverButton;
