/* global EDITOR_URL */

import React from 'react';
import PropTypes from 'prop-types';

const showIcon = "https://cdn.gomix.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fshow-app.svg";

export const PreviewButton = ({name}) => (
  <a className="button button-link" href={`https://${name}.glitch.me`}>
    <img src={showIcon} alt=""/>
    Preview
  </a>
);
PreviewButton.propTypes = {
  name: PropTypes.string.isRequired,
};

export const EditorButton = ({name, isMember}) => (
  <a className="button button-link" href={`${EDITOR_URL}#!/${name}`}>
    {isMember ? 'Edit Project' : 'View Source'}
  </a>
);
EditorButton.propTypes = {
  name: PropTypes.string.isRequired,
  isMember: PropTypes.bool,
};

export const Buttons = ({name, isMember}) => (
  <React.Fragment>
    <PreviewButton name={name}/>
    <EditorButton name={name} isMember={isMember}/>
  </React.Fragment>
);
Buttons.propTypes = {
  name: PropTypes.string.isRequired,
  isMember: PropTypes.bool,
};
export default Buttons;