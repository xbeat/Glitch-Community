import React from 'react';
import PropTypes from 'prop-types';

import ProjectsList from "./projects-list.jsx";

/* globals Set */

const projectStateFromModels = (projectsModel, pinnedProjectsModel) => {
  const pinnedIds = pinnedProjectsModel.map(({projectId}) => projectId);
  const pinnedSet = new Set(pinnedIds);
  console.log("projects and fetched projects", projectsModel, projectsModel.filter(project => project.fetched()));
  const projects = projectsModel.filter(project => project.fetched()).map(project => project.asProps());
  const pinnedProjects = projects.filter( (project) => pinnedSet.has(project.id));
  const recentProjects = projects.filter( (project) => !pinnedSet.has(project.id));
  return {pinnedProjects, recentProjects};
}

export class UserPageProjectsContainer extends React.Component {
  constructor(props) {
    super(props)
     
    this.state = {
      pinnedProjects: [],
      recentProjects: [],
    };
  }
  
  const aggregateObservable = Observable(()=>
    const projects = projectsObservable(); //touch projects to subscribe
    const projectsFetchedItems = projects.forEach((project) => project.fetched()); //touch 'fetched' to subscribe to each
  );
  aggregateObservable.observe( () => {
    //either the array was modified, or an item has become fetched 
  })
  aggregateObservable.releaseDependencies() // garbage collect.
  
  componentDidMount() {
    const updateState = (projectsModel, pinsModel) => {
      const newState = projectStateFromModels(projectsModel, pinsModel);
      this.setState(newState);
      console.log("updating state", newState);
    }
    
    // Observe the collections for collection-size changes
    this.props.projectsObservable.observe((projectsModel) => updateState(projectsModel, this.props.pinsObservable()));
    this.props.pinsObservable.observe((pinsModel) => updateState(this.props.projectsObservable(), pinsModel));
    
    this.props.projectsObservable.filter(project => !project.fetched()).for
    
    updateState(this.props.projectsObservable(), this.props.pinsObservable());
  }
  
  // Ideally, garbage-collect the listeners in componentWillUnmount.
  // These listeners don't have a way to unsubscribe,
  // So just deal with it instead.
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