import React from 'react';
import PropTypes from 'prop-types';

import EditCollectionColorPop from '../pop-overs/edit-collection-color-pop.jsx';
import PopoverContainer from '../pop-overs/popover-container.jsx';

const EditCollectionColor = ({currentUserIsOwner, ...props}) => {
  if(!currentUserIsOwner) {
    return null;
  }
  
  return (
    <PopoverContainer>
      {({visible, togglePopover}) => (
        <div className="button-wrap">
          <button className={`button add-project opens-pop-over`} onClick={togglePopover}>
                Color
          </button>
          { visible && <EditCollectionColorPop {...props} togglePopover={togglePopover} /> }
        </div>
      )}
    </PopoverContainer>
  );
};

export default EditCollectionColor;
