import React from 'react';
import PropTypes from 'prop-types';
import {chunk, keyBy, partition} from 'lodash';

import Loader from './includes/loader.jsx';
import ProjectsList from './projects-list.jsx';


/* globals Set */

function listToObject(list, val) {
  return list.reduce((data, key) => ({[key]: val, ...data}), {});
}

const psst = "https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fpsst.svg?1500486136908";

const EntityPageProjects = ({projects, pins, isAuthorized, isLoaded, addPin, removePin, projectOptions}) => {
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
          projects={pinnedProjects} placeholder={isLoaded ? pinnedEmpty : null}
          projectOptions={isAuthorized ? {removePin, ...projectOptions} : {}}
        />
      )}
      <ProjectsList title="Recent Projects" projects={recentProjects}
        projectOptions={isAuthorized ? {addPin, ...projectOptions} : {}}
      />
      {!isLoaded && <Loader/>}
    </React.Fragment>
  );
};
EntityPageProjects.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  projects: PropTypes.array.isRequired,
  pins: PropTypes.arrayOf(PropTypes.shape({
    projectId: PropTypes.string.isRequired,
  }).isRequired).isRequired,
  addPin: PropTypes.func.isRequired,
  removePin: PropTypes.func.isRequired,
  projectOptions: PropTypes.object.isRequired,
};

export default class EntityPageProjectsLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  ensureProjects(projects) {
    const ids = projects.map(({id}) => id);
    const discardedProjects = Object.keys(this.state).filter(id => this.state[id] && !ids.includes(id));
    if (discardedProjects.length) {
      this.setState(listToObject(discardedProjects, undefined));
    }
    const unloadedProjects = ids.filter(id => this.state[id] === undefined);
    if (unloadedProjects.length) {
      this.setState(listToObject(unloadedProjects, null));
      chunk(unloadedProjects, 50).forEach(chunk => {
        this.props.getProjects(chunk).then(projects => {
          this.setState(keyBy(projects, ({id}) => id));
        });
      });
    }
  }
  
  componentDidMount() {
    this.ensureProjects(this.props.projects);
  }
  
  componentDidUpdate() {
    this.ensureProjects(this.props.projects);
  }
  
  render() {
    const {projects, ...props} = this.props;
    const loadedProjects = projects.map(project => this.state[project.id]).filter(project => project);
    return <EntityPageProjects projects={loadedProjects} isLoaded={loadedProjects.length === projects.length} {...props}/>;
  }
}
EntityPageProjectsLoader.propTypes = {
  projects: PropTypes.array.isRequired,
  getProjects: PropTypes.func.isRequired,
};