import React from 'react';
import PropTypes from 'prop-types';

import ProjectsList from './projects-list.jsx';

import {CurrentUserConsumer} from './current-user.jsx';

/* globals Set */

const psst = "https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fpsst.svg?1500486136908";

const EntityPagePinnedProjects = ({api, projects, pins, currentUser, isAuthorized, removePin, projectOptions}) => {
  const pinnedSet = new Set(pins.map(({projectId}) => projectId));
  const pinnedProjects = projects.filter( ({id}) => pinnedSet.has(id));
  
  const pinnedVisible = (isAuthorized || pinnedProjects.length) && projects.length;
  
  const pinnedTitle = (
    <React.Fragment>
      Pinned Projects
      <span className="emoji pushpin emoji-in-title"></span>
    </React.Fragment>
  );
  
  const pinnedEmpty = (
    <React.Fragment>
      <img className="psst" src={psst} alt="psst"></img>
      <p>
        Pin your projects to show them off
        <span className="emoji pushpin"></span>
      </p>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      {!!pinnedVisible && (
        <ProjectsList title={pinnedTitle}
          projects={pinnedProjects} placeholder={pinnedEmpty}
          api={api}
          addProjectTocollection={currentUser.login ? projectOptions.addProjectToCollection :  {}}
          projectOptions={isAuthorized ? {removePin, ...projectOptions} 
            : (currentUser.login ? {...projectOptions} : {})
          }
        />
      )}
    </React.Fragment>
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
