import React from 'react';
import PropTypes from 'prop-types';

export const UserPageProjects = ({isCurrentUser, projects, pinnedProjectIds, projectOptions}) => {
  
   function recentProjects() {
      const recentProjects = self.projects().filter(project => project.fetched() && !_.includes(self.pinnedProjectIds(), project.id()));
      const props = {
        closeAllPopOvers: application.closeAllPopOvers,
        title: "Recent Projects",
        isPinned: false,
        projects: recentProjects.map(project => project.asProps()),
        projectOptions: self.projectOptions()
      };
      return <ProjectsList {...props}></ProjectsList>;
    }
    
    function pinnedProjectsList() {
      const pinnedProjects = self.projects().filter(project => project.fetched() && _.includes(self.pinnedProjectIds(), project.id()));
      const props = {
        closeAllPopOvers: application.closeAllPopOvers,
        title: "Pinned Projects",
        isPinned: true,
        projects: pinnedProjects.map(project => project.asProps()),
        projectOptions: self.projectOptions()
      };
      return <ProjectsList {...props}></ProjectsList>;
    }
      
    return (
    <React.Fragment>
      { !(!isCurrentUser && pinnedProjects.length === 0) && pinnedProjectsList()}
      { recentProjects() }
    </React.Fragment>
      );
  
  
};

export default UserPageProjects;