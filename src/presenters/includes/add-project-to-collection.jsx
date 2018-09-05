import React from 'react';
import PropTypes from 'prop-types';

import AddCollectionProjectPop from '../pop-overs/add-collection-project-pop.jsx';
import PopoverContainer from '../pop-overs/popover-container.jsx';

const AddProjectToCollection = ({...props}) => {
  
  return (
      <PopoverContainer>
        {({visible, togglePopover}) => (
          <div className="button-wrap">
            <button className={`button add-project opens-pop-over`} onClick={togglePopover}>
              Add to Collection
            </button>
            { visible && <AddCollectionProjectPop {...props} togglePopover={togglePopover} /> }
          </div>
        )}
      </PopoverContainer>
  );
};

AddProjectToCollection .propTypes = {
  addProject: PropTypes.func.isRequired,
  api: PropTypes.func.isRequired
};

export default AddProjectToCollection;
