import React from "react";
import PropTypes from "prop-types";
import PopoverContainer from "./popover-container.jsx";

const PopoverWithButton = props => {
  return (
    <PopoverContainer>
      {({ visible, togglePopover }) => {
        let childrenToPass = props.children;
        if (props.passTogglePopoverToPop) {
          const updatedChildren = React.Children.map(
            this.props.children,
            child => {
              return React.cloneElement(child, { togglePopover });
            }
          );
          childrenToPass = updatedChildren;
        }
        return (
          <div className="button-wrap">
            <button
              className={"button-small " + props.buttonClass}
              data-track={props.dataTrack}
              onClick={togglePopover}
            >
              {props.buttonText}
            </button>
            {visible && childrenToPass}
          </div>
        );
      }}
    </PopoverContainer>
  );
};

PopoverWithButton.propTypes = {
  buttonClass: PropTypes.string,
  dataTrack: PropTypes.string,
  buttonText: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired, // should be the stuff to show in a popover
  passTogglePopoverToPop: PropTypes.bool
};

PopoverWithButton.defaultProps = {
  buttonClass: "",
  dataTrack: "",
  passTogglePopoverToPop: false
};

export default PopoverWithButton;
