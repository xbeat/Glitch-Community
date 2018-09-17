import React from 'react';
import PropTypes from 'prop-types';

import AddCollectionAvatarPop from '../pop-overs/add-collection-avatar-pop.jsx';
import PopoverContainer from '../pop-overs/popover-container.jsx';

const AddCollectionProject = ({currentUserIsOwner, ...props}) => {
  if(!currentUserIsOwner) {
    return null;
  }
  
  return (
    <PopoverContainer>
      {({visible, togglePopover}) => (
        <div className="button-wrap">
          <button className={`button replace-avatar opens-pop-over`} onClick={togglePopover}>
              Hello World
          </button>
          { visible && <AddCollectionAvatarPop {...props} togglePopover={togglePopover} /> }
        </div>
      )}
    </PopoverContainer>
  );
};

AddCollectionProject.propTypes = {
  api: PropTypes.func.isRequired
};

export default AddCollectionProject;
