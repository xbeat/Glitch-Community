 import React from 'react';
import PropTypes from 'prop-types';

import ProjectsList from './projects-list';

const EntityPageProjects = ({ api, projects, currentUser, isAuthorized, addPin, removePin, projectOptions }) => {
  const pinnedTitle = (
    <>
      Pinned Projects
      <span className="emoji pushpin emoji-in-title" />
    </>
  );

  const recentTitle = 'Recent Projects';
  let projectOptionsToPass = {};
  if (isAuthorized) {
    projectOptionsToPass = { addPin, removePin, ...projectOptions };
  } else if (currentUser && currentUser.login) {
    projectOptionsToPass = { ...projectOptions };
  }
  return (
    <>
      {projects.length > 0 && (
        <ProjectsList title={removePin ? pinnedTitle : recentTitle} projects={projects} api={api} projectOptions={projectOptionsToPass} />
      )}
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

EntityPageProjects.defaultProps = {
  addPin: null,
  removePin: null,
  projectOptions: {},
  currentUser: null,
};

export default EntityPageProjects;
