import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from './popover-container';
import Button from '../../components/buttons/button';

const PopoverWithButton = (props) => (
  <PopoverContainer>
    {({ visible, togglePopover }) => {
      let childrenToShow = props.children;
      if (props.passToggleToPop) {
        childrenToShow = React.Children.map(props.children, (child) => React.cloneElement(child, { togglePopover }));
      }
      return (
        <div className={`popover-wrap ${props.containerClass}`}>
          <Button onClick={togglePopover} size={props.buttonClass}>
            {props.buttonText}
          </Button>
          {visible && childrenToShow}
        </div>
      );
    }}
  </PopoverContainer>
);

PopoverWithButton.propTypes = {
  buttonClass: PropTypes.string,
  containerClass: PropTypes.string,
  buttonText: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired, // should be the stuff to show in a popover
  passToggleToPop: PropTypes.bool,
};

PopoverWithButton.defaultProps = {
  buttonClass: null,
  containerClass: null,
  passToggleToPop: false,
};

export default PopoverWithButton;
