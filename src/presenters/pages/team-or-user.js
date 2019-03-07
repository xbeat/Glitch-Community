import React from 'react';
import PropTypes from 'prop-types';
import { getSingleItem, getAllPages } from '../../../shared/api';

import { DataLoader } from '../includes/loader';
import NotFound from '../includes/not-found';

import Layout from '../layout';
import TeamPage from './team';
import UserPage from './user';

const getOrNull = async (api, route) => {
  try {
    const { data } = await api.get(route);
    return data;
  } catch (error) {
    if (error && error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

const allByKeys = async (objOfPromises) => {
  const keys = Object.keys(objOfPromises);
  const values = await Promise.all(Object.values(objOfPromises));
  return keys.reduce((result, key, i) => {
    result[key] = values[i];
    return result;
  }, {});
};

// TODO: where is this used?
// const getUserById = async (api, id) => {
//   const user = await getOrNull(api, `/users/${id}`);
//   return user;
// };
// TODO: is this used frequently enough that we'd want to 


const getUser = async (api, name) => {
  const data = await allByKeys({
    user: getSingleItem(api, `v1/users/by/login?login=${name}`, name),
    // TODO: this actually seems to work OK with large collections, 
    // but we'll want to do lazy pagination eventually
    pins: getAllPages(api, `v1/users/by/login/pinnedProjects?login=${name}&limit=100&orderKey=createdAt&orderDirection=DESC`),
    projects: getAllPages(api, `v1/users/by/login/projects?login=${name}&limit=100&orderKey=createdAt&orderDirection=DESC`),
    teams: getAllPages(api, `v1/users/by/login/teams?login=${name}&limit=100&orderKey=createdAt&orderDirection=DESC`),
    collections: getAllPages(api, `v1/users/by/login/collections?login=${name}&limit=100&orderKey=createdAt&orderDirection=DESC`),
  });
  const { user, ...rest } = data;
  return { ...user, ...rest };
};

const parseTeam = (team) => {
  const ADMIN_ACCESS_LEVEL = 30;
  const adminIds = team.teamPermissions.filter((user) => user.accessLevel === ADMIN_ACCESS_LEVEL);
  team.adminIds = adminIds.map((user) => user.userId);
  return team;
};

const getTeamById = async (api, id) => {
  const team = await getOrNull(api, `/teams/${id}`);
  return team && parseTeam(team);
};

const getTeam = async (api, name) => {
  const team = await getSingleItem(api, `v1/teams/by/url?url=${name}`, name);
  if (team) {
    const [users, pinnedProjects, projects, collections] = await Promise.all([
      // load all users, need to handle pagination
      getAllPages(api, `v1/teams/by/id/users?id=${team.id}&orderKey=createdAt&orderDirection=ASC&limit=100`),
      getAllPages(api, `v1/teams/by/id/pinnedProjects?id=${team.id}&orderKey=createdAt&orderDirection=DESC&limit=100`),
      getAllPages(api, `v1/teams/by/id/projects?id=${team.id}&orderKey=createdAt&orderDirection=DESC&limit=100`),
      getAllPages(api, `v1/teams/by/id/collections?id=${team.id}&orderKey=createdAt&orderDirection=DESC&limit=100`),
    ]);

    team.users = users.sort((a, b) => new Date(a.teamPermission.updatedAt) - new Date(b.teamPermission.updatedAt));
    team.projects = projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    team.teamPins = pinnedProjects.map((project) => ({ projectId: project.id }));
    team.collections = collections;
  }
  return team && parseTeam(team);
};

const TeamPageLoader = ({ api, id, name, ...props }) => (
  <DataLoader get={() => getTeamById(api, id)}>
    {(team) => (team ? <TeamPage api={api} team={team} {...props} /> : <NotFound name={name} />)}
  </DataLoader>
);
TeamPageLoader.propTypes = {
  api: PropTypes.any,
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

TeamPageLoader.defaultProps = {
  api: null,
};

const UserPageLoader = ({ api, id, name, ...props }) => (
  <DataLoader get={() => getUserById(api, id)}>
    {(user) => (user ? <UserPage api={api} user={user} {...props} /> : <NotFound name={name} />)}
  </DataLoader>
);
UserPageLoader.propTypes = {
  api: PropTypes.any,
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};
UserPageLoader.defaultProps = {
  api: null,
};

const TeamOrUserPageLoader = ({ api, name, ...props }) => (
  <DataLoader get={() => getTeam(api, name)}>
    {(team) =>
      team ? (
        <TeamPage api={api} team={team} {...props} />
      ) : (
        <DataLoader get={() => getUser(api, name)}>
          {(user) => (user ? <UserPage api={api} user={user} {...props} /> : <NotFound name={name} />)}
        </DataLoader>
      )
    }
  </DataLoader>
);
TeamOrUserPageLoader.propTypes = {
  api: PropTypes.any,
  name: PropTypes.string.isRequired,
};

TeamOrUserPageLoader.defaultProps = {
  api: null,
};

const Presenter = (api, Loader, args) => (
  <Layout api={api}>
    <Loader api={api} {...args} />
  </Layout>
);

const TeamPagePresenter = ({ api, id, name }) => Presenter(api, TeamPageLoader, { id, name });
const UserPagePresenter = ({ api, id, name }) => Presenter(api, UserPageLoader, { id, name });
const TeamOrUserPagePresenter = ({ api, name }) => Presenter(api, TeamOrUserPageLoader, { name });
export { TeamPagePresenter as TeamPage, UserPagePresenter as UserPage, TeamOrUserPagePresenter as TeamOrUserPage };
