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
            <React.Fragment>
              <button className={`button add-project opens-pop-over`} onClick={togglePopover}>
                Color
              </button>
              { visible && <EditCollectionColorPop {...props} togglePopover={togglePopover} /> }
            </React.Fragment>
        )}
      </PopoverContainer>
  );
};

export default EditCollectionColor;
