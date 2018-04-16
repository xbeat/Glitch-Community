import React from 'react';
import PropTypes from 'prop-types';

import ProjectsList from "./projects-list.jsx";

/* globals Set */

const projectStateFromModels = (projectsModel, pinnedProjectsModel) => {
  const pinnedIds = pinnedProjectsModel.map(({projectId}) => projectId);
  const pinnedSet = new Set(pinnedIds);
  const projects = projectsModel.filter(project => project.fetched()).map(project => project.asProps());
  const pinnedProjects = projects.filter( (project) => pinnedSet.has(project.id));
  const recentProjects = projects.filter( (project) => !pinnedSet.has(project.id));
  return {pinnedProjects, recentProjects};
}

export class UserPageProjectsContainer extends React.Component {
  constructor(props) {
    super(props)
     
    this.state = projectStateFromModels(props.projectsObservable(), props.pinsObservable())
    console.log("initial state", this.state)
  }
  
  componntDidMount() {
    const updateState = (projectsModel, pinsModel) => {
      const newState = projectStateFromModels(projectsModel, pinsModel);
      this.setState(newState);
      console.log("updating state", newState);
    }
    
    this.props.projectsObservable.observe((projectsModel) => updateState(projectsModel, this.props.pinsObservable()));
    this.props.pinsObservable.observe((pinsModel) => updateState(this.props.projectsObservable(), pinsModel));
    
    updateState(this.props.projectsObservable(), props.pinsObservable());
  }
  componentWillUnmount(){
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