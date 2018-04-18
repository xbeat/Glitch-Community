import React from 'react';
import PropTypes from 'prop-types';
import ProjectsList from "./projects-list.jsx";
import {debounce} from "lodash";


/* globals Set */

const projectStateFromModels = (projectsModel, pinsModel) => {
  const pinnedIds = pinsModel.map(({projectId}) => projectId);
  const pinnedSet = new Set(pinnedIds);
  const projects = projectsModel.filter(project => project.fetched()).map(project => project.asProps());
  const pinnedProjects = projects.filter( (project) => pinnedSet.has(project.id));
  const recentProjects = projects.filter( (project) => !pinnedSet.has(project.id));
  return {pinnedProjects, recentProjects};
}

export class EntityPageProjectsContainer extends React.Component {
  constructor(props) {
    super(props)
     
    this.state = {
      recentProjects: [],
      pinnedProjects: [],
    };
    
    this.aggregateObservable = null;
    this.setStateFromModels = debounce((projectsModel, pinsModel, Component) => {
      Component.setState(projectStateFromModels(projectsModel, pinsModel));
    }, 10);
  }

  componentDidMount() {
    const cb = () => { 
      this.setStateFromModels(this.props.projectsObservable(), this.props.pinsObservable(), this);
    }

    this.props.projectsObservable.observe(cb);
    this.props.pinsObservable.observe(cb);
    // Subscribe just to the 'fetched' subcomponent of the projects.
    this.props.projectsObservable.forEach(project => project.fetched.observe(cb));

    cb();
  }
  
  componentWillUnmount(){
    this.aggregateObservable && this.aggregateObservable.releaseDependencies();
    this.aggregateObservable = null;
  }

  render() {
    return <EntityPageProjects {...this.props} {...this.state}/>
  }
}
EntityPageProjectsContainer.propTypes = {
  projectsObservable: PropTypes.func.isRequired,
  pinsObservable: PropTypes.func.isRequired,
  isAuthorizedUser: PropTypes.bool.isRequired,
  closeAllPopOvers: PropTypes.func.isRequired,
  projectOptions: PropTypes.object.isRequired,
};

const EntityPageProjects = ({closeAllPopOvers, isAuthorizedUser, recentProjects, pinnedProjects, projectOptions}) => {

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
  recentProjects: PropTypes.array.isRequired,
  pinnedProjects: PropTypes.array.isRequired,
  isAuthorizedUser: PropTypes.bool.isRequired,
};

export default EntityPageProjectsContainer;