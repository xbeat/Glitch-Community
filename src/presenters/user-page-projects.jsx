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
  
   const RecentProjectsList = (props) => {
      return <ProjectsList title="Recent Projects" isPinned={false} {...props}></ProjectsList>;
    }
    
    const PinnedProjectsList = (props) => {

      if (!isCurrentUser && pinnedProjects.length === 0) {
        return null;
      }

      const props = {
        title: "Pinned Projects",
        isPinned: true,
        projects: pinnedProjects,
      };
      return <ProjectsList {...commonProps} {...props}></ProjectsList>;
    }
    
    return (
    <React.Fragment>
      <PinnedProjectsList {...commonProps} projects={pinnedProjects}/>
      <RecentProjectsList {...commonProps} projects={recentProjects}/>
      <ProjectsList title="Recent Projects" isPinned={false} projects={recentProjects} {...commonProps}/;
    </React.Fragment>
      );
  
  
};

export default UserPageProjects;