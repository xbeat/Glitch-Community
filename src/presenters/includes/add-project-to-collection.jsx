import React from 'react';
import PropTypes from 'prop-types';

import AddProjectToCollectionPop from '../pop-overs/add-project-to-collection-pop.jsx';
import PopoverWithButton from './popover-with-button';

const AddProjectToCollection = ({project, ...props}) => {
  
  return (
    <PopoverWithButton buttonClass="button button-small has-emoji add-project opens-pop-over" 
      buttonText={<>Add to Collection {' '}<span className="emoji framed-picture" role="presentation"></span></>}
      passToggleToPop
    >
      <AddProjectToCollectionPop {...props} project={project} />
    </PopoverWithButton>
  );
};

AddProjectToCollection .propTypes = {
  addProjectToCollection: PropTypes.func.isRequired,
  api: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
};

export default AddProjectToCollection;
