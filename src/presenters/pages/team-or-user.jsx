import React from 'react';
import PropTypes from 'prop-types';

import TeamModel from '../../models/team';
import UserModel from '../../models/user';
import ProjectModel from '../../models/project';
import Reactlet from '../reactlet';
import LayoutPresenter from '../layout';

import {CurrentUserProvider} from '../current-user.jsx';
import {DataLoader} from '../includes/loader.jsx';
import NotFound from '../includes/not-found.jsx';
import {Notifications} from '../notifications.jsx';

import UserPage from './user.jsx';
import TeamPage from './team.jsx';

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

// this func will eventually live in the layout
const PageWrapper = ({currentUserModel, children}) => (
  <Notifications>
    <CurrentUserProvider model={currentUserModel}>
      {children}
    </CurrentUserProvider>
  </Notifications>
);

const TeamPageLoader = ({api, currentUserModel, id, name, ...props}) => (
  <PageWrapper currentUserModel={currentUserModel}>
    <DataLoader get={() => getTeamById(api, id)}>
      {team => team ? (
        <TeamPage api={api} currentUserModel={currentUserModel} team={team} {...props}/>
      ) : (
        <NotFound name={name}/>
      )}
    </DataLoader>
  </PageWrapper>
);
TeamPageLoader.propTypes = {
  api: PropTypes.any.isRequired,
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

const UserPageLoader = ({api, currentUserModel, id, name, ...props}) => (
  <PageWrapper currentUserModel={currentUserModel}>
    <DataLoader get={() => getUserById(api, id)}>
      {user => user ? (
        <UserPage api={api} currentUserModel={currentUserModel} user={user} {...props}/>
      ) : (
        <NotFound name={name}/>
      )}
    </DataLoader>
  </PageWrapper>
);
UserPageLoader.propTypes = {
  api: PropTypes.any.isRequired,
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

const TeamOrUserPageLoader = ({api, currentUserModel, name, ...props}) => (
  <PageWrapper currentUserModel={currentUserModel}>
    <DataLoader get={() => getTeam(api, name)}>
      {team => team ? (
        <TeamPage api={api} currentUserModel={currentUserModel} team={team} {...props}/>
      ) : (
        <DataLoader get={() => getUser(api, name)}>
          {user => user ? (
            <UserPage api={api} currentUserModel={currentUserModel} user={user} {...props}/>
          ) : (
            <NotFound name={name}/>
          )}
        </DataLoader>
      )}
    </DataLoader>
  </PageWrapper>
);
TeamOrUserPageLoader.propTypes = {
  api: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
};

function Presenter(application, Loader, args) {
  const props = {
    api: application.api(),
    currentUserModel: application.currentUser(),
    searchUsers: (query) => UserModel.getSearchResultsJSON(application, query).then(users => users.map(user => UserModel(user).asProps())),
    getProjects: (ids) => application.api().get(`projects/byIds?ids=${ids.join(',')}`).then(({data}) => data.map(d => ProjectModel(d).update(d).asProps())),
    ...args,
  };
  const content = Reactlet(Loader, props);
  return LayoutPresenter(application, content);
}

export const TeamPagePresenter = (application, id, name) => Presenter(application, TeamPageLoader, {id, name});
export const UserPagePresenter = (application, id, name) => Presenter(application, UserPageLoader, {id, name});
export const TeamOrUserPagePresenter = (application, name) => Presenter(application, TeamOrUserPageLoader, {name});