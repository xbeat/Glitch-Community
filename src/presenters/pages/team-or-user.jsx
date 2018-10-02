import React from 'react';
import PropTypes from 'prop-types';

import TeamModel from '../../models/team';
import UserModel from '../../models/user';

import {DataLoader} from '../includes/loader.jsx';
import NotFound from '../includes/not-found.jsx';

import Layout from '../layout.jsx';
import TeamPage from './team.jsx';
import UserPage from './user.jsx';

const getOrNull = async(api, route) => {
  try {
    const {data} = await api.get(route);
    return data;
  } catch (error) {
    if (error && error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

const getUserById = async (api, id) => {
  const user = await getOrNull(api, `users/${id}`);
  return user && UserModel(user).asProps();
};

const getUser = async (api, name) => {
  const id = await getOrNull(api, `userId/byLogin/${name}`);
  if (id === "NOT FOUND") {
    return null;
  }
  return await getUserById(api, id);
};

const parseTeam = (team) => {
  const ADMIN_ACCESS_LEVEL = 30;
  const adminIds = team.users.filter(user => {
    return user.teamsUser.accessLevel === ADMIN_ACCESS_LEVEL;
  });
  team.adminIds = adminIds.map(user => user.id);
  return TeamModel(team).asProps();
};

const getTeamById = async (api, id) => {
  const team = await getOrNull(api, `teams/${id}`);
  return team && parseTeam(team);
};

const getTeam = async (api, name) => {
  const team = await getOrNull(api, `teams/byUrl/${name}`);
  return team && parseTeam(team);
};

const TeamPageLoader = ({api, id, name, ...props}) => (
  <DataLoader get={() => getTeamById(api, id)}>
    {team => team ? (
      <TeamPage api={api} team={team} {...props}/>
    ) : (
      <NotFound name={name}/>
    )}
  </DataLoader>
);
TeamPageLoader.propTypes = {
  api: PropTypes.any.isRequired,
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

const UserPageLoader = ({api, id, name, ...props}) => (
  <DataLoader get={() => getUserById(api, id)}>
    {user => user ? (
      <UserPage api={api} user={user} {...props}/>
    ) : (
      <NotFound name={name}/>
    )}
  </DataLoader>
);
UserPageLoader.propTypes = {
  api: PropTypes.any.isRequired,
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

const TeamOrUserPageLoader = ({api, name, ...props}) => (
  <DataLoader get={() => getTeam(api, name)}>
    {team => team ? (
      <TeamPage api={api} team={team} {...props}/>
    ) : (
      <DataLoader get={() => getUser(api, name)}>
        {user => user ? (
          <UserPage api={api} user={user} {...props}/>
        ) : (
          <NotFound name={name}/>
        )}
      </DataLoader>
    )}
  </DataLoader>
);
TeamOrUserPageLoader.propTypes = {
  api: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
};

const Presenter = (api, Loader, args) => (
  <Layout api={api}>
    <Loader api={api} {...args}/>
  </Layout>
);

const TeamPagePresenter = ({api, id, name}) => Presenter(api, TeamPageLoader, {id, name});
const UserPagePresenter = ({api, id, name}) => Presenter(api, UserPageLoader, {id, name});
const TeamOrUserPagePresenter = ({api, name}) => Presenter(api, TeamOrUserPageLoader, {name});
export {TeamPagePresenter as TeamPage, UserPagePresenter as UserPage, TeamOrUserPagePresenter as TeamOrUserPage};