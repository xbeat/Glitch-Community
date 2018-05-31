import React from 'react';
import PropTypes from 'prop-types';

const showIcon = "https://cdn.gomix.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fshow-app.svg";

export const Preview = ({name}) => (
  <a className="button button-link" href={`https://${name}.glitch.me`}>
    <img src={showIcon} alt=""/>
    Preview
  </a>
);
Preview.propTypes = {
  name: PropTypes.string.isRequired,
};

export const Buttons = ({name}) => (
  <React.Fragment>
    <Preview name={name}/>
  </React.Fragment>
);
Buttons.propTypes = {
  name: PropTypes.string.isRequired,
};
export default Buttons;