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
          <button className={`button add-project opens-pop-over`} onClick={togglePopover}>
              Replace Avatar
          </button>
          { visible && <AddCollectionAvatarPop {...props} togglePopover={togglePopover} /> }
        </div>
      )}
    </PopoverContainer>
  );
};

AddCollectionProject.propTypes = {
  currentUserIsOwner: PropTypes.bool.isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
  myProjects: PropTypes.array.isRequired,
  collectionProjects: PropTypes.array.isRequired,
  api: PropTypes.func.isRequired
};

export default AddCollectionProject;
