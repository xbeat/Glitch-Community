import React from 'react';
import PropTypes from 'prop-types';
import {chunk, keyBy} from 'lodash';

import {CurrentUserConsumer, normalizeProjects} from './current-user.jsx';

function listToObject(list, val) {
  return list.reduce((data, key) => ({[key]: val, ...data}), {});
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
    const loadedProjects = projects.map(project => this.state[project.id] || project);
    return (
      <CurrentUserConsumer>
        {currentUser => (
          <EntityPageProjects
            projects={normalizeProjects(loadedProjects, currentUser)}
            {...props}
          />
        )}
      </CurrentUserConsumer>
    );
  }
}
ProjectsLoader.propTypes = {
  projects: PropTypes.array.isRequired,
  getProjects: PropTypes.func.isRequired,
};