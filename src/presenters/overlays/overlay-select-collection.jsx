import React from 'react';
import PropTypes from 'prop-types';

import PopoverContainer from '../pop-overs/popover-container.jsx';

const OverlaySelectCollection = ({children}) => (
  <PopoverContainer>
    {({visible, setVisible}) => (
      <details onToggle={evt => setVisible(evt.target.open)} open={visible} className="overlay-container">
        <summary>{children}</summary>
        <dialog className="overlay">
          <section className="pop-over-actions">
            Hello World
          </section>
        </dialog>
      </details>
    )}
  </PopoverContainer>
);
OverlaySelectCollection.propTypes = {
  children: PropTypes.node.isRequired,
};

export default OverlaySelectCollection;