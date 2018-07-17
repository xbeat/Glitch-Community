import React from 'react';
import PropTypes from 'prop-types';

import TeamModel from '../../models/team';

import {DataLoader} from '../includes/loader.jsx';
import NotFound from '../includes/not-found.jsx';

import UserPage from './user.jsx';
import TeamPage from './team.jsx';

const getUser = async (api, name) => {
  const {data: id} = await api.get(`userId/byLogin/${name}`);
  const {data: user} = await api.get(`users/${id}`);
  return user;
};

const getTeam = async(api, name) => {
  const {data} = await api.get(`teams/byUrl/${name}`);
  return data && TeamModel(data).update(data).asProps();
}

const TeamOrUserPage = ({api, name, ...props}) => (
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
TeamOrUserPage.propTypes = {
  api: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
};

const PageWrapper = ({currentUserModel, ...props}) => (
  <Notifications>
    <CurrentUserProvider model={currentUserModel}>
      <TeamOrUserPage currentUserModel={currentUserModel} {...props}/>
    </CurrentUserProvider>
  </Notifications>
);

export default TeamOrUserPage;