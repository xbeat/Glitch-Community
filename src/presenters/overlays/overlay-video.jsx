import React from 'react';
import PropTypes from 'prop-types';

import PopoverContainer from '../pop-overs/popover-container.jsx';

const Video = () => (
  <div className="wistia_responsive_padding">
    <div className="wistia_responsive_wrapper">
      <div className="wistia_embed wistia_async_vskja9agqj" videofoam="true">
      </div>
    </div>
  </div>
);

const OverlayVideo = ({children}) => (
  <PopoverContainer>
    {({visible, setVisible}) => (
      <details onToggle={evt => setVisible(evt.target.open)} open={visible}>
        <summary>{children}</summary>
        <div className="overlay-background">
          <dialog className="overlay video-overlay">
            <Video/>
          </dialog>
        </div>
      </details>
    )}
  </PopoverContainer>
);
OverlayVideo.propTypes = {
  children: PropTypes.node.isRequired,
};

export default OverlayVideo;