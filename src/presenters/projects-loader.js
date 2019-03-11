import React from 'react';
import PropTypes from 'prop-types';
import { chunk } from 'lodash';

import { getFromApi, joinIdsToQueryString } from '../../shared/api';

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

  async loadProjects(...projectIds) {
    if (!projectIds.length) return;

    // Having to re-add users to the projects makes this kind of weird
    let projects = await getFromApi(this.props.api, `v1/projects/by/id?${joinIdsToQueryString(projectIds)}`);

    // Need to iterate so we grab some values to make an array
    projects = Object.values(projects);

    // We want to perform these in parallel, so I'm mapping over the values rather than using a for loop
    // It's causing some weirdness with the async/await turning into an array of promises
    projects = projects.map(async (project) => {
      const userIds = project.permissions.map((permission) => permission.userId);
      const users = await getFromApi(this.props.api, `v1/users/by/id?${joinIdsToQueryString(userIds)}`);
      return {
        ...project,
        users: Object.values(users),
      };
    });
    // But for now it's okay, so resolve the promises please
    projects = await Promise.all(projects);
    // Then turn the projects back into the format that state is expecting
    projects = keyByVal(projects, 'id');

    // Going to collect _all_ the user IDs here now
    const allUserIds = projects.reduce((userIds, project) => {
      userIds.concat(project.permissions.map((permission) => permission.userId));
    });
    console.log('allUserIds', allUserIds);

    this.setState(projects);
  }

  ensureProjects(projects) {
    const ids = projects.map(({ id }) => id);

    const discardedProjects = Object.keys(this.state).filter((id) => this.state[id] && !ids.includes(id));
    if (discardedProjects.length) {
      this.setState(listToObject(discardedProjects, undefined));
    }

    const unloadedProjects = ids.filter((id) => this.state[id] === undefined);
    if (unloadedProjects.length) {
      this.setState(listToObject(unloadedProjects, null));
      chunk(unloadedProjects, 100).forEach((currentChunk) => this.loadProjects(...currentChunk));
    }
  }

  render() {
    const { children, projects } = this.props;
    const loadedProjects = projects.map((project) => this.state[project.id] || project);
    return (
      <CurrentUserConsumer>
        {(currentUser) => children(normalizeProjects(loadedProjects, currentUser), this.loadProjects.bind(this))}
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
