import React from 'react';
import PropTypes from 'prop-types';

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

const getUserById = async (api, id) => {
  const user = await getOrNull(api, `/users/${id}`);
  return user;
};

const getUser = async (api, name) => {
  const id = await getOrNull(api, `/userId/byLogin/${name}`);
  if (id === 'NOT FOUND') {
    return null;
  }
  return getUserById(api, id);
};

const parseTeam = (team) => {
  const ADMIN_ACCESS_LEVEL = 30;
  const adminIds = team.teamPermissions.filter(user => user.accessLevel === ADMIN_ACCESS_LEVEL);
  team.adminIds = adminIds.map(user => user.userId);
  team.users = [];
  team.projects = [];
  team.teamPins = [];
  team.collections = [];
  return team;
};

const getTeamById = async (api, id) => {
  const team = await getOrNull(api, `/teams/${id}`);
  return team && parseTeam(team);
};

const getTeam = async (api, name) => {
  const { data } = await api.get(`v1/teams/by/url?url=${name}`);
  return data[name] && parseTeam(data[name]);
};

const TeamPageLoader = ({
  api, id, name, ...props
}) => (
  <DataLoader get={() => getTeamById(api, id)}>
    {team => (team ? (
      <TeamPage api={api} team={team} {...props} />
    ) : (
      <NotFound name={name} />
    ))
    }
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

const UserPageLoader = ({
  api, id, name, ...props
}) => (
  <DataLoader get={() => getUserById(api, id)}>
    {user => (user ? (
      <UserPage api={api} user={user} {...props} />
    ) : (
      <NotFound name={name} />
    ))
    }
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
    {team => (team ? (
      <TeamPage api={api} team={team} {...props} />
    ) : (
      <DataLoader get={() => getUser(api, name)}>
        {user => (user ? (
          <UserPage api={api} user={user} {...props} />
        ) : (
          <NotFound name={name} />
        ))
        }
      </DataLoader>
    ))
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
export {
  TeamPagePresenter as TeamPage,
  UserPagePresenter as UserPage,
  TeamOrUserPagePresenter as TeamOrUserPage,
};
