import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ProjectsList from './projects-list.jsx';

import {CurrentUserConsumer} from './current-user.jsx';

/* globals Set */

const EntityPageProjects = ({api, projects, pins, currentUser, isAuthorized, addPin, projectOptions}) => {
  const pinnedSet = new Set(pins.map(({projectId}) => projectId));
  const [pinnedProjects, recentProjects] = _.partition(projects, ({id}) => pinnedSet.has(id));

  return (
    <React.Fragment>
      {!!recentProjects.length && (
        <ProjectsList title="Recent Projects" projects={recentProjects}
          api={api}
          addProjectToCollection={currentUser.login ? projectOptions.addProjectToCollection : {}}
          projectOptions={isAuthorized ? {addPin, ...projectOptions} 
            : (currentUser.login ? {...projectOptions} : {})
          }
        />
      )}
    </React.Fragment>
  );
};
EntityPageProjects.propTypes = {
  api: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  isAuthorized: PropTypes.bool.isRequired,
  projects: PropTypes.array.isRequired,
  pins: PropTypes.arrayOf(PropTypes.shape({
    projectId: PropTypes.string.isRequired,
  }).isRequired).isRequired,
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
