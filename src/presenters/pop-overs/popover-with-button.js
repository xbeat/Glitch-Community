import React from 'react';
import PropTypes from 'prop-types';
import Button, { TYPES, SIZES } from '_comp/buttons/button';
import PopoverContainer from './popover-container';

const PopoverWithButton = (props) => (
  <PopoverContainer>
    {({ visible, togglePopover }) => {
      let childrenToShow = props.children;
      if (props.passToggleToPop) {
        childrenToShow = React.Children.map(props.children, (child) => React.cloneElement(child, { togglePopover }));
      }
      return (
        <div className={`popover-wrap ${props.containerClass}`}>
          <Button onClick={togglePopover} size={props.buttonSize} type={props.buttonType}>
            {props.buttonText}
          </Button>
          {visible && childrenToShow}
        </div>
      );
    }}
  </PopoverContainer>
);

PopoverWithButton.propTypes = {
  buttonType: PropTypes.oneOf(TYPES),
  buttonSize: PropTypes.oneOf(SIZES),
  containerClass: PropTypes.string,
  buttonText: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired, // should be the stuff to show in a popover
  passToggleToPop: PropTypes.bool,
};

PopoverWithButton.defaultProps = {
  buttonType: null,
  buttonSize: null,
  containerClass: null,
  passToggleToPop: false,
};

export default PopoverWithButton;
