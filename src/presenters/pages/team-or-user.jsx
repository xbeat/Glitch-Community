import React from 'react';
import PropTypes from 'prop-types';

import TeamModel from '../../models/team';

import {DataLoader} from '../includes/loader.jsx';
import NotFound from '../includes/not-found.jsx';

import Layout from '../layout.jsx';
import TeamPage from './team.jsx';
import UserPage from './user.jsx';

const getUserById = async (api, id) => {
  const {data} = await api.get(`users/${id}`);
  return data;
};

const getUser = async (api, name) => {
  const {data} = await api.get(`userId/byLogin/${name}`);
  if (data === "NOT FOUND") {
    return null;
  }
  return getUserById(api, data);
};

const getTeamById = async (api, id) => {
  const {data} = await api.get(`teams/${id}`);
  return data && TeamModel(data).update(data).asProps();
};

const getTeam = async(api, name) => {
  const {data} = await api.get(`teams/byUrl/${name}`);
  return data && TeamModel(data).update(data).asProps();
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

const Presenter = (application, Loader, args) => (
  <Layout application={application}>
    <Loader api={application.api()} {...args}/>
  </Layout>
);

const TeamPagePresenter = ({application, id, name}) => Presenter(application, TeamPageLoader, {id, name});
const UserPagePresenter = ({application, id, name}) => Presenter(application, UserPageLoader, {id, name});
const TeamOrUserPagePresenter = ({application, name}) => Presenter(application, TeamOrUserPageLoader, {name});
export {TeamPagePresenter as TeamPage, UserPagePresenter as UserPage, TeamOrUserPagePresenter as TeamOrUserPage};