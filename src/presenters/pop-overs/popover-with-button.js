import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from './popover-container';

const PopoverWithButton = ({ dataTrack, containerClass, buttonClass, buttonText, children: renderChildren }) => (
  <PopoverContainer>
    {({ visible, togglePopover }) => (
      <div className={`button-wrap ${containerClass}`}>
        <button className={buttonClass} data-track={dataTrack} onClick={togglePopover} type="button">
          {buttonText}
        </button>
        {visible && renderChildren({ togglePopover })}
      </div>
    )}
  </PopoverContainer>
);

PopoverWithButton.propTypes = {
  buttonClass: PropTypes.string,
  containerClass: PropTypes.string,
  dataTrack: PropTypes.string,
  buttonText: PropTypes.node.isRequired,
  children: PropTypes.func.isRequired,
};

PopoverWithButton.defaultProps = {
<<<<<<< HEAD
  buttonClass: null,
  containerClass: null,
  dataTrack: null,
  passToggleToPop: false,
=======
  buttonClass: '',
  containerClass: '',
  dataTrack: '',
>>>>>>> e10be3f50f3fc226556adbfd862a7daa6f27be16
};

export default PopoverWithButton;
