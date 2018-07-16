import React from 'react';
import PropTypes from 'prop-types';

import {DataLoader} from '../includes/loader.jsx';

const getUser = async (api, name) => {
  const {data: id} = await api.get(`userId/byLogin/${name}`);
  const {data: user} = await api.get(`users/${id}`);
  return user;
};

const getTeam = async(api, name) => {
  const {data} = await api.get(`teams/byUrl/${name}`);
  return data;
}

const UserOrTeamPage = ({api, name}) => (
  <DataLoader get={() => getTeam(api, name)}>
    {team => team ? (
      <TeamPage api={api} team={team}/>
    ) : (
      <DataLoader get={() => getUser(api, name)}>
        {user => user ? (
          <UserPage ap
    )}
  </DataLoader>
);