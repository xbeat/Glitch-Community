import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from './popover-container.jsx';

const PopoverWithButton = props => {
  return (
    <PopoverContainer>
      {({ visible, togglePopover }) => {
        let childrenToShow = props.children;
        if (props.passToggleToPop) {
          childrenToShow = React.Children.map(props.children, child => React.cloneElement(child, { togglePopover: togglePopover }));
        }
        return (
          <div className={"button-wrap " + props.containerClass}>
            <button
              className={props.buttonClass}
              data-track={props.dataTrack}
              onClick={props.dropdown ? null : togglePopover}
            >
              {props.buttonText}
              {props.dropdown && <span className="down-arrow icon" aria-label="options"></span>}
            </button>
            {visible && childrenToShow}
          </div>
        );
      }}
    </PopoverContainer>
  );
};

PopoverWithButton.propTypes = {
  buttonClass: PropTypes.string,
  containerClass: PropTypes.string,
  dataTrack: PropTypes.string,
  dropdown: PropTypes.bool,
  buttonText: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired, // should be the stuff to show in a popover
  passToggleToPop: PropTypes.bool
};

PopoverWithButton.defaultProps = {
  buttonClass: "",
  containerClass: "",
  dataTrack: "",
  passToggleToPop: false
};

export default PopoverWithButton;
