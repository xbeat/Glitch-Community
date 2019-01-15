import React from 'react';
import PropTypes from 'prop-types';
import ProjectsList from './projects-list.jsx';

import {CurrentUserConsumer} from './current-user.jsx';

/* globals Set */

const EntityPageProjects = ({api, projects, currentUser, isAuthorized, addPin, projectOptions}) => {

  return (
    <>
      {!!projects.length && (
        <ProjectsList title="Recent Projects" projects={projects}
          api={api}
          projectOptions={isAuthorized ? {addPin, ...projectOptions} 
            : (currentUser && currentUser.login ? {...projectOptions} : {})
          }
        />
      )}
    </>
  );
};
EntityPageProjects.propTypes = {
  api: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  isAuthorized: PropTypes.bool.isRequired,
  projects: PropTypes.array.isRequired,
  addPin: PropTypes.func.isRequired,
  projectOptions: PropTypes.object,
};

const EntityPageProjectsContainer = ({api, projects, ...props}) => (
  <CurrentUserConsumer>
    {currentUser => (
      <EntityPageProjects api={api} projects={projects} currentUser={currentUser} {...props}/>
    )}
  </CurrentUserConsumer>
);

export default EntityPageProjectsContainer;  
