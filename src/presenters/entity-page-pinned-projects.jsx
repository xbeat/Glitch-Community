import React from 'react';
import PropTypes from 'prop-types';

import ProjectsList from './projects-list.jsx';

import {CurrentUserConsumer} from './current-user.jsx';

/* globals Set */

<<<<<<< HEAD:src/presenters/entity-page-pinned-projects.jsx
const psst = "https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fpsst.svg?1500486136908";

const EntityPagePinnedProjects = ({api, projects, pins, currentUser, isAuthorized, removePin, projectOptions}) => {
=======
const EntityPageProjects = ({projects, pins, isAuthorized, addPin, removePin, projectOptions}) => {
>>>>>>> 35e836243266b5299bf71937240a47dcdd2b0970:src/presenters/entity-page-projects.jsx
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
<<<<<<< HEAD:src/presenters/entity-page-pinned-projects.jsx
          projects={pinnedProjects} placeholder={pinnedEmpty}
          api={api}
          addProjectTocollection={currentUser.login ? projectOptions.addProjectToCollection :  {}}
          projectOptions={isAuthorized ? {removePin, ...projectOptions} 
            : (currentUser.login ? {...projectOptions} : {})
          }
=======
          projects={pinnedProjects} 
          projectOptions={isAuthorized ? {removePin, ...projectOptions} : {}}
        />
      )}
      {!!recentProjects.length && (
        <ProjectsList title="Recent Projects" projects={recentProjects}
          projectOptions={isAuthorized ? {addPin, ...projectOptions} : {}}
>>>>>>> 35e836243266b5299bf71937240a47dcdd2b0970:src/presenters/entity-page-projects.jsx
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
