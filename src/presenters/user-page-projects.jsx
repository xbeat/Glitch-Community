import React from 'react';
import PropTypes from 'prop-types';

import ProjectsList from "./projects-list.jsx";

/* globals Set */

const projectStateFromModels = (projectsModel, pinnedProjectsModel) => {
    const pinnedIds = pinnedProjectsModel.map(project => project.id);
    const pinnedSet = new Set(pinnedIds);
    const projects = projectsModel.filter(project => project.fetched()).map(project => project.asProps());
    const pinnedProjects = projects.filter( (project) => pinnedSet.has(project.id));
    const recentProjects = projects.filter( (project) => !pinnedSet.has(project.id));
    return {pinnedProjects, recentProjects};
}

export class UserPageProjectsContainer extends React.Component {
   constructor(props) {
    super(props)
    
    const updateState = () => {
        const newState = projectStateFromModels(props.projectsObservable(), props.pinsObservable());
        this.setState(newState);
        console.log("updating state", newState);
    }
    
    props.projectsObservable.observe(updateState);
    props.pinsObservable.observe(updateState);
     
   this.state =  projectStateFromModels(props.projectsObservable(), props.pinsObservable())
  }


  render() {    
    return <UserPageProjects {...this.props} {...this.state}/>
  }
}
UserPageProjectsContainer.propTypes = {
  projectsObservable: PropTypes.func.isRequired,
  pinsObservable: PropTypes.func.isRequired,
};

export const UserPageProjects = ({closeAllPopOvers, isCurrentUser, recentProjects, pinnedProjects, projectOptions}) => {

  const commonProps = {
    closeAllPopOvers,
    projectOptions,
  };
  
  const showPinnedProjects = isCurrentUser || pinnedProjects.length !== 0;
  return (
    <React.Fragment>
      { showPinnedProjects && (
        <ProjectsList title="Pinned Projects" isPinned={true} projects={pinnedProjects} {...commonProps}/>
      )}
      <ProjectsList title="Recent Projects" projects={recentProjects} {...commonProps}/>
    </React.Fragment>
  );
};

UserPageProjects.propTypes = {
  recentProjects: PropTypes.array.isRequired,
  pinnedProjects: PropTypes.array.isRequired,
  isCurrentUser: PropTypes.bool.isRequired,
};

export default UserPageProjectsContainer;