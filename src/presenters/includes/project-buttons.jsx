import React from 'react';

const showIcon = "https://cdn.gomix.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fshow-app.svg";

export const Preview = ({name}) => {
  return (
    <a className="button button-link" href={`https://${name}.glitch.me`}>
      <img src={showIcon} alt=""/>
      Preview
    </a>
  );
};

export const Buttons = ({name

export default Buttons;