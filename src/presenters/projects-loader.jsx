import React from 'react';
import PropTypes from 'prop-types';
import {chunk, keyBy} from 'lodash';

import ProjectModel from '../models/project';

import {CurrentUserConsumer, normalizeProjects} from './current-user.jsx';

function listToObject(list, val) {
  return list.reduce((data, key) => ({[key]: val, ...data}), {});
}

async function getProjects(api, ids) {
  const {data} = await api.get(`projects/byIds?ids=${ids.join(',')}`);
  return data.map(d => ProjectModel(d).update(d).asProps());
}

export default class ProjectsLoader extends React.Component {
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
      chunk(unloadedProjects, 100).forEach(chunk => {
        getProjects(this.props.api, chunk).then(projects => {
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
  
  reloadProjects(projectId) {
    // setting the project to undefined refetch
    this.setState({
      [projectId]: undefined
    })
  }
  
  render() {
    const {children, projects} = this.props;
    const loadedProjects = projects.map(project => this.state[project.id] || project);
    return (
      <CurrentUserConsumer>
        {currentUser => (
          children(normalizeProjects(loadedProjects, currentUser))
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