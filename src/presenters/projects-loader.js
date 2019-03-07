import React from 'react';
import PropTypes from 'prop-types';
import { chunk } from 'lodash';

import { CurrentUserConsumer, normalizeProjects } from './current-user';

function listToObject(list, val) {
  return list.reduce((data, key) => ({ ...data, [key]: val }), {});
}

function keyByVal(list, key) {
  return list.reduce((data, val) => ({ ...data, [val[key]]: val }), {});
}

class ProjectsLoader extends React.Component {
  constructor(props) {
    super(props);
    // state is { [project id]: project|null|undefined }
    // undefined means we haven't seen that project yet
    // null means the project is still getting loaded
    this.state = {};
  }

  componentDidMount() {
    this.ensureProjects(this.props.projects);
  }

  componentDidUpdate() {
    this.ensureProjects(this.props.projects);
  }

  // I think this pattern is a little funky town and we might want to look into other options. It's not immediately obvious the props.projects of these child components are totally different from the props.projects of parent components of this component,
  // maybe this could be solved with a variable name change (projectDetails as an example) or by defining this load Projects function at a higher component.
  async loadProjects(...ids) {
    if (!ids.length) return;
    const { data } = await this.props.api.get(
      `projects/byIds?ids=${ids.join(',')}`,
    );
    this.setState(keyByVal(data, 'id'));
  }

  ensureProjects(projects) {
    const ids = projects.map(({ id }) => id);

    const discardedProjects = Object.keys(this.state).filter(
      id => this.state[id] && !ids.includes(id),
    );
    if (discardedProjects.length) {
      this.setState(listToObject(discardedProjects, undefined));
    }

    const unloadedProjects = ids.filter(id => this.state[id] === undefined);
    if (unloadedProjects.length) {
      this.setState(listToObject(unloadedProjects, null));
      chunk(unloadedProjects, 100).forEach(currentChunk => this.loadProjects(...currentChunk));
    }
  }

  render() {
    const { children, projects } = this.props;
    const loadedProjects = projects.map(project => ({ ...project, ...this.state[project.id] }));
    return (
      <CurrentUserConsumer>
        {currentUser => children(
          normalizeProjects(loadedProjects, currentUser),
          this.loadProjects.bind(this),
        )
        }
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
