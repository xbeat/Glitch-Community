import React from 'react';
import PropTypes from 'prop-types';

import ProjectsList from './projects-list.jsx';

const EntityPageProjects = ({api, projects, currentUser, isAuthorized, addPin, removePin, projectOptions, title}) => {
  const pinnedTitle = (
    <>
      Pinned Projects
      <span className="emoji pushpin emoji-in-title"></span>
    </>
  );
  
  const recentTitle = "Recent Projects";
  
  return (
    <>
     {projects.length > 0 && 
        <ProjectsList title={removePin ? pinnedTitle : recentTitle}
          projects={projects}
          api={api} 
          projectOptions={isAuthorized ? {addPin, removePin, ...projectOptions} 
            : (currentUser && currentUser.login ? {...projectOptions} : {})
          }
        />
     }
    </>
  );
};
EntityPageProjects.propTypes = {
  api: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  isAuthorized: PropTypes.bool.isRequired,
  projects: PropTypes.array.isRequired,
  addPin: PropTypes.func,
  removePin: PropTypes.func,
  projectOptions: PropTypes.object,
};

const EntityPageProjectsContainer = ({api, projects, maybeCurrentUser, ...props}) => (  
  <EntityPageProjects api={api} projects={projects} currentUser={maybeCurrentUser} {...props}/>  
);

export default EntityPageProjectsContainer;  
