import React from 'react';
import PropTypes from 'prop-types';
import ProjectsList from "./projects-list.jsx";
import Loader from "./includes/loader.jsx"

export const UserPageProjects = ({...props}) => {
  console.log ('⛵️', props.projects[0])
  
  // ?normalize user projects format into something that matches project.js as Props (ugh)
  
  const projects = props.projects.map(function (project) {
    console.log ('1', project.description())
    let {...projectProps} = project.asProps();
    console.log ('2', projectProps.description)
    return projectProps;
  });
  console.log ('✅',projects)
  return (
    <EntityPageProjects {...props} projects={projects} />
  )
}
UserPageProjects.propTypes = {
  projects: PropTypes.array.isRequired,
  pins: PropTypes.array.isRequired,
  isAuthorizedUser: PropTypes.bool.isRequired,
  closeAllPopOvers: PropTypes.func.isRequired,
  projectOptions: PropTypes.object.isRequired,
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
