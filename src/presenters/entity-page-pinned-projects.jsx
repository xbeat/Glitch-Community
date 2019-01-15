import React from 'react';
import PropTypes from 'prop-types';

import ProjectsList from './projects-list.jsx';

/* globals Set */

const EntityPagePinnedProjects = ({api, projects, currentUser, isAuthorized, removePin, projectOptions}) => {
      
  const pinnedTitle = (
    <>
      Pinned Projects
      <span className="emoji pushpin emoji-in-title"></span>
    </>
  );
  
  return (
    <>
     {projects.length > 0 && 
        <ProjectsList title={pinnedTitle}
          projects={projects}
          api={api} 
          projectOptions={isAuthorized ? {removePin, ...projectOptions} 
            : (currentUser && currentUser.login ? {...projectOptions} : {})
          }
          extraClasses="pinned"
        />
     }
    </>
  );
};
EntityPagePinnedProjects.propTypes = {
  api: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  isAuthorized: PropTypes.bool.isRequired,
  projects: PropTypes.array.isRequired,
  removePin: PropTypes.func.isRequired,
  projectOptions: PropTypes.object,
};

const EntityPagePinnedProjectsContainer = ({api, projects, maybeCurrentUser, ...props}) => (  
  <EntityPagePinnedProjects api={api} projects={projects} currentUser={maybeCurrentUser} {...props}/>  
);

export default EntityPagePinnedProjectsContainer;  
