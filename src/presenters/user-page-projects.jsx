import React from 'react';
import PropTypes from 'prop-types';

/* globals Set */

export const UserPageProjects = ({closeAllPopOvers, isCurrentUser, projects, pinnedProjectIds, projectOptions}) => {

  const pinnedSet = new Set(pinnedProjectIds);
  const pinnedProjects = projects.filter( (project) => pinnedSet.has(project.id));
  const recentProjects = projects.filter( (project) => !pinnedSet.has(project.id));
  
  const commonProps = {
    closeAllPopOvers: closeAllPopOvers,
    projectOptions: self.projectOptions()
  };

  const PinnedProjectsList = (props) => {
    if (!isCurrentUser && pinnedProjects.length === 0) {
      return null;
    }

    return <ProjectsList title="Pinned Projects" isPinned={true} {...props}></ProjectsList>;
  }
    
  return (
    <React.Fragment>
      <PinnedProjectsList {...commonProps} projects={pinnedProjects}/>
      <ProjectsList title="Recent Projects" projects={recentProjects} {...commonProps}/>
    </React.Fragment>
  );
};

export default UserPageProjects;