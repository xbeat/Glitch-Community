import React from "react";
import PropTypes from "prop-types";

<<<<<<< HEAD
import AddProjectToCollectionPop from "../pop-overs/add-project-to-collection-pop.jsx";
import PopoverWithButton from "../pop-overs/popover-with-button";

const AddProjectToCollection = ({ project, ...props }) => {
  return (
    <PopoverWithButton
      buttonClass="button-small has-emoji add-project"
      buttonText={
        <>
          Add to Collection{" "}
          <span className="emoji framed-picture" role="presentation" />
        </>
      }
      passToggleToPop
    >
      <AddProjectToCollectionPop {...props} project={project} />
    </PopoverWithButton>
  );
};

AddProjectToCollection.propTypes = {
  addProjectToCollection: PropTypes.func.isRequired,
  api: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired
=======
import AddProjectToCollectionPop from '../pop-overs/add-project-to-collection-pop';
import PopoverWithButton from '../pop-overs/popover-with-button';

const AddProjectToCollection = ({ project, ...props }) => (
  <PopoverWithButton
    buttonClass="button-small has-emoji add-project"
    buttonText={(
      <>
          Add to Collection
        {' '}
        <span className="emoji framed-picture" role="presentation" />
      </>
    )}
    passToggleToPop
  >
    <AddProjectToCollectionPop {...props} project={project} />
  </PopoverWithButton>
);

AddProjectToCollection.propTypes = {
  addProjectToCollection: PropTypes.func.isRequired,
  api: PropTypes.func,
  project: PropTypes.object.isRequired,
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
};
AddProjectToCollection.defaultProps = {
  api: null,
};

export default AddProjectToCollection;
