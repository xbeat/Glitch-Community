import React from 'react';
import PropTypes from 'prop-types';
import ProjectsList from "./projects-list.jsx";
import Observable from "o_0";
import {chunk, debounce, keyBy, partition} from 'lodash';


/* globals Set */

const projectStateFromModels = (projectsModel, pinsModel) => {
  const pinnedIds = pinsModel.map(({projectId}) => projectId);
  const pinnedSet = new Set(pinnedIds);
  const projects = projectsModel.filter(project => project.fetched()).map(project => project.asProps());
  const pinnedProjects = projects.filter( (project) => pinnedSet.has(project.id));
  const recentProjects = projects.filter( (project) => !pinnedSet.has(project.id));
  return {pinnedProjects, recentProjects};
};

export const TeamEntityPageProjects = ({closeAllPopOvers, isAuthorizedUser, projects, pins, projectOptions}) => {
  const commonProps = {
    closeAllPopOvers,
    projectOptions,
  };
  let pinIds = pins.map(pin => {
    return pin.projectId;
  });
  let recentProjects = projects.filter(project => {
    return !pinIds.includes(project.id);
  });
  let pinnedProjects = projects.filter(project => {
    return pinIds.includes(project.id);
  });
  
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

TeamEntityPageProjects.propTypes = {
  pins: PropTypes.array.isRequired,
  projects: PropTypes.array.isRequired,
  isAuthorizedUser: PropTypes.bool.isRequired,
  closeAllPopOvers: PropTypes.func.isRequired,
  projectOptions: PropTypes.object.isRequired,
};


export class EntityPageProjectsContainer extends React.Component {
  
  constructor(props) {
    super(props);
     
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
    this.aggregateObservable = Observable(() => {
      const projectsModel = this.props.projectsObservable();
      const pinsModel = this.props.pinsObservable();
      
      // Subscribe just to the 'fetched' subcomponent of the projects.
      for(let {fetched} of projectsModel) {
        fetched && fetched();
      }
      
      this.setStateFromModels(projectsModel, pinsModel, this);
    });
  }
  
  componentWillUnmount(){
    this.aggregateObservable && this.aggregateObservable.releaseDependencies();
    this.aggregateObservable = null;
  }

  render() {
    return <EntityPageProjects {...this.props} {...this.state}/>;
  }
}

EntityPageProjectsContainer.propTypes = {
  projectsObservable: PropTypes.func.isRequired,
  pinsObservable: PropTypes.func.isRequired,
  isAuthorizedUser: PropTypes.bool.isRequired,
  closeAllPopOvers: PropTypes.func.isRequired,
  projectOptions: PropTypes.object.isRequired,
};

export const EntityPageProjects = ({closeAllPopOvers, isAuthorizedUser, recentProjects, pinnedProjects, projectOptions}) => {

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
  pinnedProjects: PropTypes.array.isRequired,
  isAuthorizedUser: PropTypes.bool.isRequired,
};

const psst = "https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fpsst.svg?1500486136908";

const NewEntityPageProjects = ({projects, pins, isAuthorized, addPin, removePin, projectOptions}) => {
  const pinnedSet = new Set(pins.map(({projectId}) => projectId));
  const [pinnedProjects, recentProjects] = partition(projects, ({id}) => pinnedSet.has(id));
  
  const pinnedVisible = isAuthorized || pinnedProjects.length;
  
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
          projectOptions={isAuthorized ? {removePin, ...projectOptions} : {}}
        />
      )}
      <ProjectsList
        title="Recent Projects" projects={recentProjects}
        projectOptions={isAuthorized ? {addPin, ...projectOptions} : {}}
      />
    </React.Fragment>
  );
};

//todo? adding a project will update props, may need a new request
export default class NewEntityPageProjectsLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  ensureProjects(projects) {
    const unloadedProjects = projects.filter(({id}) => !(id in this.state));
    chunk(unloadedProjects, 50).forEach(projects => {
      const ids = projects.map(({id}) => id);
      this.props.getProjects(ids).then(projects => {
        this.setState(keyBy(projects, ({id}) => id));
      });
    });
  }
  
  componentDidMount() {
    this.ensureProjects(this.props.projects);
  }
  
  render() {
    const {projects, ...props} = this.props;
    const loadedProjects = projects.map(project => this.state[project.id] || project);
    return <NewEntityPageProjects projects={loadedProjects} {...props}/>;
  }
}