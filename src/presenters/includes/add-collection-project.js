import React from 'react';
import PropTypes from 'prop-types';

import AddCollectionProjectPop from '../pop-overs/add-collection-project-pop';
import PopoverWithButton from '../pop-overs/popover-with-button';
import { useAsync } from '../../state/api';
import { useCurrentUser } from '../../state/current-user';

async function getTeamProjects(api, teamId) {
  if (teamId > 0) {
    const { data: team } = await api.get(`teams/${teamId}`);
    console.log({ team })
    return team.projects;
  }
  return null;
}

function AddCollectionProject({ collection, addProjectToCollection }) {
  const maybeTeamProjects = useAsync(getTeamProjects, collection.teamId);
  const { currentUser } = useCurrentUser();

  let initialProjects = [];
  if (maybeTeamProjects) {
    initialProjects = maybeTeamProjects;
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
