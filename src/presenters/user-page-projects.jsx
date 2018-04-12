import React from 'react';
import PropTypes from 'prop-types';

/* globals Set */

const PinnedProjectsList = ({isCurrentUser, projects, ...props}) => {
  if (!isCurrentUser && projects.length === 0) {
    return null;
  }

  return <ProjectsList title="Pinned Projects" isPinned={true} {...props}></ProjectsList>;
}

PinnedProjectsList.propTypes ={
  
  isCurrentUser: PropTypes.bool.isRequired,
};

export const UserPageProjects = ({closeAllPopOvers, isCurrentUser, projects, pinnedProjectIds, projectOptions}) => {

  const pinnedSet = new Set(pinnedProjectIds);
  const pinnedProjects = projects.filter( (project) => pinnedSet.has(project.id));
  const recentProjects = projects.filter( (project) => !pinnedSet.has(project.id));
  
  const commonProps = {
    closeAllPopOvers: closeAllPopOvers,
    projectOptions: projectOptions,
  };
  return (
    <React.Fragment>
      <PinnedProjectsList isCurrentUser={isCurrentUser} projects={pinnedProjects} {...commonProps}/>
      <ProjectsList title="Recent Projects" projects={recentProjects} {...commonProps}/>
    </React.Fragment>
  );
};

UserPageProjects.propTypes = {
  projects: PropTypes.array.isRequired,
  pinnedProjectIds: PropTypes.array.isRequired,
};

export default UserPageProjects;