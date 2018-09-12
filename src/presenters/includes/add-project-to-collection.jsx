import React from 'react';
import PropTypes from 'prop-types';

import AddProjectToCollectionPop from '../pop-overs/add-project-to-collection-pop.jsx';
import PopoverContainer from '../pop-overs/popover-container.jsx';

const AddProjectToCollection = ({...props}) => {
  
  return (
    <PopoverContainer>
      {({visible, togglePopover}) => (
        <div className="button-wrap">
          <button className={`button button-small has-emoji add-project opens-pop-over`} onClick={togglePopover}>
              Add to Collection {' '}
            <span className="emoji framed-picture" role="presentation"></span>
          </button>
          { visible && <AddProjectToCollectionPop {...props} togglePopover={togglePopover} /> }
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
