import React from 'react';
import PropTypes from 'prop-types';

import ProjectsList from './projects-list.jsx';

import {CurrentUserConsumer} from './current-user.jsx';

/* globals Set */

const EntityPagePinnedProjects = ({api, projects, pins, currentUser, isAuthorized, removePin, projectOptions}) => {
  const pinnedSet = new Set(pins.map(({projectId}) => projectId));
  const pinnedProjects = projects.filter( ({id}) => pinnedSet.has(id));
  
  const pinnedVisible = (isAuthorized || pinnedProjects.length) && projects.length;
  
  const pinnedTitle = (
    <>
      Pinned Projects
      <span className="emoji pushpin emoji-in-title"></span>
    </>
  );
  
  return (
    <>
      {!!pinnedVisible && !!pinnedProjects.length && (
        <ProjectsList title={pinnedTitle}
          projects={pinnedProjects}
          api={api}addProjectTocollection={currentUser.login ? projectOptions.addProjectToCollection :  {}}
          projectOptions={isAuthorized ? {removePin, ...projectOptions} 
            : (currentUser.login ? {...projectOptions} : {})
          }
        />
      )}
    </>
  );
};
EntityPagePinnedProjects.propTypes = {
  api: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  isAuthorized: PropTypes.bool.isRequired,
  projects: PropTypes.array.isRequired,
  pins: PropTypes.arrayOf(PropTypes.shape({
    projectId: PropTypes.string.isRequired,
  }).isRequired).isRequired,
  removePin: PropTypes.func.isRequired,
  projectOptions: PropTypes.object,
};

const EntityPagePinnedProjectsContainer = ({api, projects, ...props}) => (
  <CurrentUserConsumer>
    {currentUser => (
      <EntityPagePinnedProjects api={api} projects={projects} currentUser={currentUser} {...props}/>
    )}
  </CurrentUserConsumer>
);

export default EntityPagePinnedProjectsContainer;  
