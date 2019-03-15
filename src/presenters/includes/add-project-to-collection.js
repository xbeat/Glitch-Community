import React from 'react';
import PropTypes from 'prop-types';

import PopoverWithButton from 'src/components/popovers/popover-with-button';
import AddProjectToCollectionPop from 'src/presenters/pop-overs/add-project-to-collection-pop';

const AddProjectToCollection = ({ project, ...props }) => (
  <PopoverWithButton
    buttonClass="button-small has-emoji add-project"
    buttonText={
      <>
        Add to Collection <span className="emoji framed-picture" role="presentation" />
      </>
    }
    passToggleToPop
  >
    <AddProjectToCollectionPop {...props} project={project} />
  </PopoverWithButton>
);

AddProjectToCollection.propTypes = {
  addProjectToCollection: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  api: PropTypes.func,
};
AddProjectToCollection.defaultProps = {
  api: null,
};

export default AddProjectToCollection;
