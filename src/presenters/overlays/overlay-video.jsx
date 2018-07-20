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

function handleToggle(evt, setVisible) {
  setVisible(evt.target.open);
  if (evt.target.open) {
    evt.target.blur();
    evt.target.querySelector('video').focus();
  }
}

const OverlayVideo = ({children}) => (
  <PopoverContainer>
    {({visible, setVisible}) => (
      <details onToggle={evt => handleToggle(evt, setVisible)} open={visible} className="overlay-container">
        <summary>{children}</summary>
        <dialog className="overlay video-overlay">
          <section className="pop-over-actions">
            <Video/>
          </section>
        </dialog>
      </details>
    )}
  </PopoverContainer>
);
OverlayVideo.propTypes = {
  children: PropTypes.node.isRequired,
};

export default OverlayVideo;