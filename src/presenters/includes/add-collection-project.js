import React from 'react';
import PropTypes from 'prop-types';

import AddCollectionProjectPop from '../pop-overs/add-collection-project-pop';
import PopoverWithButton from '../pop-overs/popover-with-button';
import { useAsync } from '../../state/api';
import { useCurrentUser } from '../../state/current-user';

async function getProjects(api, teamId) {
  const { data: team } = await api.get(`teams/${teamId}`);
  return team.projects;
}

function AddCollectionProject({ collection, addProjectToCollection }) {
  const projects = useAsync(getProjects, collection.teamId);
  const { currentUser } = useCurrentUser();

  let initialProjects = [];
  if (this.props.collection.teamId > 0) {
    initialProjects = projects;
  } else if (currentUser) {
    initialProjects = currentUser.projects;
  }

  return (
    <PopoverWithButton buttonClass="add-project" buttonText="Add Project">
      {({ togglePopover }) => (
        <AddCollectionProjectPop
          collection={collection}
          initialProjects={initialProjects.slice(0, 20)}
          addProjectToCollection={addProjectToCollection}
          togglePopover={togglePopover}
        />
      )}
    </PopoverWithButton>
  );
}

AddCollectionProject.propTypes = {
  collection: PropTypes.object.isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
};

export default AddCollectionProject;
