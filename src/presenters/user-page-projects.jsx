import React from 'react';
import PropTypes from 'prop-types';

/* globals Set */

export const UserPageProjects = ({closeAllPopOvers, isCurrentUser, projects, pinnedProjectIds, projectOptions}) => {

    const pinnedSet = new Set(pinnedProjectIds);
    const pinnedProjects = projects.filter( (project) => pinnedSet.has(project.id));
    const recentProjects = projects.filter( (project) => !pinnedSet.has(project.id));
  
   const recentProjectsList = () => {
      const props = {
        closeAllPopOvers: closeAllPopOvers,
        title: "Recent Projects",
        isPinned: false,
        projects: recentProjects.map(project => project.asProps()),
        projectOptions: self.projectOptions()
      };
      return <ProjectsList {...props}></ProjectsList>;
    }
    
    const pinnedProjectsList = () => {

      if (!isCurrentUser && pinnedProjects.length === 0) {
        return null;
      }

      const props = {
        closeAllPopOvers: closeAllPopOvers,
        title: "Pinned Projects",
        isPinned: true,
        projects: pinnedProjects.map(project => project.asProps()),
        projectOptions: self.projectOptions()
      };
      return <ProjectsList {...props}></ProjectsList>;
    }
      
    return (
    <React.Fragment>
      <pinnedProjectsList></pinnedProjectsList>
      <recentProjectsList></recentProjectsList>
    </React.Fragment>
      );
  
  
};

export default UserPageProjects;