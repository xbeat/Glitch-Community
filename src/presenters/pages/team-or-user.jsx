import React from 'react';
import PropTypes from 'prop-types';

import TeamModel from '../../models/team';
import UserModel from '../../models/user';

import {DataLoader} from '../includes/loader.jsx';
import NotFound from '../includes/not-found.jsx';

import Layout from '../layout.jsx';
import TeamPage from './team.jsx';
import UserPage from './user.jsx';

const getUserById = async (api, id) => {
  const {data} = await api.get(`users/${id}`);
  return UserModel(data).asProps();
};

const getUser = async (api, name) => {
  const {data} = await api.get(`userId/byLogin/${name}`);
  if (data === "NOT FOUND") {
    return null;
  }
  return getUserById(api, data);
};

const parseTeamAdminIds = (data) => {
  if (!data) {
    return data;
  }
  const ADMIN_ACCESS_LEVEL = 30;
  let adminIds = data.users.filter(user => {
    return user.teamsUser.accessLevel === ADMIN_ACCESS_LEVEL;
  });
  data.adminIds = adminIds.map(user => {
    return user.id;
  });
  return data;
};

const getTeamById = async (api, id) => {
  let {data} = await api.get(`teams/${id}`);
  data = parseTeamAdminIds(data);
  return data && TeamModel(data).asProps();
};

const getTeam = async (api, name) => {
  let {data} = await api.get(`teams/byUrl/${name}`);
  data = parseTeamAdminIds(data);
  return data && TeamModel(data).asProps();
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