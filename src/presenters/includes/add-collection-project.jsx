import React from 'react';
import PropTypes from 'prop-types';

import AddCollectionProjectPop from '../pop-overs/add-collection-project-pop.jsx';
import PopoverContainer from '../pop-overs/popover-container.jsx';

const AddCollectionProject = ({currentUserIsOwner, ...props}) => {
  if(!currentUserIsOwner) {
    return null;
  }
  
  return (
    <section className="add-project-container">
      <PopoverContainer>
        {({visible, togglePopover}) => (
          <div className="button-wrap">
            <button className={`button add-project opens-pop-over`} onClick={togglePopover}>
              Add Project
            </button>
            { visible && <AddCollectionProjectPop {...props} togglePopover={togglePopover} /> }
          </div>
        )}
      </PopoverContainer>
    </section>
  );
};

AddCollectionProject.propTypes = {
  currentUserIsOwner: PropTypes.bool.isRequired,
  addProject: PropTypes.func.isRequired,
  myProjects: PropTypes.array.isRequired,
  teamProjects: PropTypes.array.isRequired,
  extraButtonClass: PropTypes.string,
  api: PropTypes.func.isRequired
};

export default AddCollectionProject;
