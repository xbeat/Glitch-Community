import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from './popover-container';

const PopoverWithButton = ({ passToggleToPop, containerClass, children: renderChildren }) => (
  <PopoverContainer>
    {({ visible, togglePopover }) => {
      const childProps = passToggleToPop ? {} : { togglePopover }
      
      if (props.passToggleToPop) {
        childrenToShow = React.Children.map(props.children, (child) => React.cloneElement(child, { togglePopover }));
      }
      return (
        <div className={`button-wrap ${props.containerClass}`}>
          <button className={props.buttonClass} data-track={props.dataTrack} onClick={togglePopover} type="button">
            {props.buttonText}
          </button>
          {visible && renderChildren({ togglePopover })}
        </div>
      );
    }}
  </PopoverContainer>
)

const OldPopoverWithButton = (props) => (
  <PopoverContainer>
    {({ visible, togglePopover }) => {
      let childrenToShow = props.children;
      if (props.passToggleToPop) {
        childrenToShow = React.Children.map(props.children, (child) => React.cloneElement(child, { togglePopover }));
      }
      return (
        <div className={`button-wrap ${props.containerClass}`}>
          <button className={props.buttonClass} data-track={props.dataTrack} onClick={togglePopover} type="button">
            {props.buttonText}
          </button>
          {visible && childrenToShow}
        </div>
      );
    }}
  </PopoverContainer>
);

OldPopoverWithButton.propTypes = {
  buttonClass: PropTypes.string,
  containerClass: PropTypes.string,
  dataTrack: PropTypes.string,
  buttonText: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired, // should be the stuff to show in a popover
  passToggleToPop: PropTypes.bool,
};

OldPopoverWithButton.defaultProps = {
  buttonClass: '',
  containerClass: '',
  dataTrack: '',
  passToggleToPop: false,
};

export default OldPopoverWithButton;
