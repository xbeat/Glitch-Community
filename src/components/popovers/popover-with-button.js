import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from 'src//popover-container';
import Button from '../../components/buttons/button';

const PopoverWithButton = (props) => (
  <PopoverContainer>
    {({ visible, togglePopover }) => {
      let childrenToShow = props.children;
      if (props.passToggleToPop) {
        childrenToShow = React.Children.map(props.children, (child) => React.cloneElement(child, { togglePopover }));
      }
      return (
        <div className={`button-wrap ${props.containerClass}`}>
          <Button size="small" onClick={togglePopover}>
            {props.buttonText}
          </Button>
          {visible && childrenToShow}
        </div>
      );
    }}
  </PopoverContainer>
);

PopoverWithButton.propTypes = {
  containerClass: PropTypes.string,
  buttonText: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired, // should be the stuff to show in a popover
  passToggleToPop: PropTypes.bool,
};

PopoverWithButton.defaultProps = {
  containerClass: null,
  passToggleToPop: false,
};

export default PopoverWithButton;
