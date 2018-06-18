import React from 'react';
import PropTypes from 'prop-types';
import ProjectsList from "./projects-list.jsx";
import Loader from "./includes/loader.jsx"

export const UserPageProjects = (props) => {
  //
}
UserPageProjects.propTypes = {
  projects: PropTypes.func.isRequired
}


export const EntityPageProjects = ({closeAllPopOvers, isAuthorizedUser, projects, pins, projectOptions}) => {
  const commonProps = {
    closeAllPopOvers,
    projectOptions,
  };
  let pinIds = pins.map(pin => {
    return pin.projectId
  });
  let recentProjects = projects.filter(project => {
    return !pinIds.includes(project.id)
  });
  let pinnedProjects = projects.filter(project => {
    return pinIds.includes(project.id)
  });
  
  const showPinnedProjects = isAuthorizedUser || pinnedProjects.length !== 0;
  return (
    <React.Fragment>
      { showPinnedProjects && (
        <ProjectsList title="Pinned Projects" isPinned={true} projects={pinnedProjects} {...commonProps}/>
      )}
      <ProjectsList title="Recent Projects" projects={recentProjects} {...commonProps}/>
    </React.Fragment>
  );
};

EntityPageProjects.propTypes = {
  pins: PropTypes.array.isRequired,
  projects: PropTypes.array.isRequired,
  isAuthorizedUser: PropTypes.bool.isRequired,
  closeAllPopOvers: PropTypes.func.isRequired,
  projectOptions: PropTypes.object.isRequired,
};

export default EntityPageProjects;
