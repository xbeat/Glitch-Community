import React from 'react';
import PropTypes from 'prop-types';
import {chunk} from 'lodash';

import ProjectModel from '../models/project';

import {CurrentUserConsumer, normalizeProjects} from './current-user.jsx';

function listToObject(list, val) {
  return list.reduce((data, key) => ({...data, [key]: val}), {});
}

function keyByVal(list, key) {
  return list.reduce((data, val) => ({...data, [val[key]]: val}), {});
}

class ProjectsLoader extends React.Component {
  constructor(props) {
    super(props);
    // state is { [project id]: project|null|undefined }
    // undefined means we haven't seen that project yet
    // null means the project is still getting loaded
    this.state = {};
  }
  
  async loadProjects(...ids) {
    if (!ids.length) return;
    const {data} = await this.props.api.get(`projects/byIds?ids=${ids.join(',')}`);
    const projects = data.map(d => ProjectModel(d));
    this.setState(keyByVal(projects, 'id'));
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
      chunk(unloadedProjects, 100).forEach(chunk => this.loadProjects(...chunk));
    }
  }
  
  componentDidMount() {
    this.ensureProjects(this.props.projects);
  }
  
  componentDidUpdate() {
    this.ensureProjects(this.props.projects);
  }
  
  render() {
    const {children, projects} = this.props;
    const loadedProjects = projects.map(project => this.state[project.id] || project);
    return (
      <CurrentUserConsumer>
        {currentUser => (
          children(normalizeProjects(loadedProjects, currentUser), this.loadProjects.bind(this))
        )}
      </CurrentUserConsumer>
    );
  }
}
ProjectsLoader.propTypes = {
  api: PropTypes.any.isRequired,
  children: PropTypes.func.isRequired,
  projects: PropTypes.array.isRequired,
};

export default ProjectsLoader;