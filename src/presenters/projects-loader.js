import React from 'react';
import PropTypes from 'prop-types';
import { chunk, uniq } from 'lodash';

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

    let projects = await getFromApi(this.props.api, `v1/projects/by/id?${joinIdsToQueryString(projectIds)}`);
    // Convert projects from the format state expects to an array
    projects = Object.values(projects);

    // Gather unique user IDs for all of the projects being loaded
    const userIdsPerProject = projects.map(({ permissions }) => permissions.map(({ userId }) => userId));
    const uniqueUserIds = uniq(userIdsPerProject.reduceRight((accumulator, value) => accumulator.concat(value)));

    // Load all of the users for this set of projects
    const users = await getFromApi(this.props.api, `v1/users/by/id?${joinIdsToQueryString(uniqueUserIds)}`);

    // Go back over the projects and pick users out of the array by ID based on permissions
    projects = projects.map((project) => {
      const projectUsers = [];
      project.permissions.map(({ userId }) => projectUsers.push(users[userId]));
      return {
        ...project,
        users: projectUsers,
      };
    });

    // Put projects back into the format state expects
    projects = keyByVal(projects, 'id');
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
