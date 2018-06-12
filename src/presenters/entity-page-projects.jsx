import React from 'react';
import PropTypes from 'prop-types';
import ProjectsList from "./projects-list.jsx";
import {debounce} from 'lodash';


/* globals Set */

const projectStateFromModels = (projectsModel, pinsModel) => {
  const pinnedIds = pinsModel.map(({projectId}) => projectId);
  const pinnedSet = new Set(pinnedIds);
  const projects = projectsModel.filter(project => project.fetched()).map(project => project.asProps());
  const pinnedProjects = projects.filter( (project) => pinnedSet.has(project.id));
  const recentProjects = projects.filter( (project) => !pinnedSet.has(project.id));
  return {pinnedProjects, recentProjects};
};

const EntityPageProjects = ({closeAllPopOvers, isAuthorizedUser, projectsModel, pinsModel, projectOptions}) => {

  const {pinnedProjects, recentProjects} =  projectStateFromModels(projectsModel, pinsModel)
  
  const commonProps = {
    closeAllPopOvers,
    projectOptions,
  };
  
  const showPinnedProjects = isAuthorizedUser || pinnedProjects.length !== 0;
  return (
    <React.Fragment>
      { showPinnedProjects && (
        <ProjectsList title="Pinned Projects" isPinned={true} projects={pinnedProjects} {...commonProps}/>
      )}
      <ProjectsList title="Recent Projects" projects={recentProjects} {...commonProps}/>
    </React.Fragment>
  );
};

EntityPageProjects.propTypes = {
  pinsModel: PropTypes.array.isRequired,
  isAuthorizedUser: PropTypes.bool.isRequired,
};

export default EntityPageProjects;