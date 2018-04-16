import React from 'react';
import PropTypes from 'prop-types';

import ProjectsList from "./projects-list.jsx";

/* globals Set */

export const UserPageProjectsContainer = ({closeAllPopOvers, isCurrentUser, projectsObservable, pinnedProjectsObservable, projectOptions}) => {

  const pinnedSet = new Set(pinnedProjectIds);
  const pinnedProjects = projects.filter( (project) => pinnedSet.has(project.id));
  const recentProjects = projects.filter( (project) => !pinnedSet.has(project.id));
  
  export class ProjectOptionsContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = { visible: false }
  }

  render() {
    return <UserPageProjects/>
  }
}
  // {closeAllPopOvers, isCurrentUser, projectsObservable, pinnedProjectsObservable, projectOptions}

export const UserPageProjects = ({closeAllPopOvers, isCurrentUser, projects, pinnedProjectIds, projectOptions}) => {

  const pinnedSet = new Set(pinnedProjectIds);
  const pinnedProjects = projects.filter( (project) => pinnedSet.has(project.id));
  const recentProjects = projects.filter( (project) => !pinnedSet.has(project.id));
  
  const commonProps = {
    closeAllPopOvers,
    projectOptions,
  };
  
  const showPinnedProjects = isCurrentUser || pinnedProjects.length !== 0;
  return (
    <React.Fragment>
      { showPinnedProjects && (
        <ProjectsList title="Pinned Projects" isPinned={true} projects={pinnedProjects} {...commonProps}/>
      )}
      <ProjectsList title="Recent Projects" projects={recentProjects} {...commonProps}/>
    </React.Fragment>
  );
};

UserPageProjects.propTypes = {
  projects: PropTypes.array.isRequired,
  pinnedProjectIds: PropTypes.array.isRequired,
  isCurrentUser: PropTypes.bool.isRequired,
};

export default UserPageProjectsContainer;