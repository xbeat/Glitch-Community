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

const getUser = async (api, name) => {
  const {data: id} = await api.get(`userId/byLogin/${name}`);
  if (isNaN(id)) {
    return null;
  }
  const {data: user} = await api.get(`users/${id}`);
  return user;
};

const getTeam = async(api, name) => {
  const {data} = await api.get(`teams/byUrl/${name}`);
  return data && TeamModel(data).update(data).asProps();
};

const PageWrapper = ({currentUserModel, children}) => (
  <Notifications>
    <CurrentUserProvider model={currentUserModel}>
      {children}
    </CurrentUserProvider>
  </Notifications>
);

const TeamPage

const TeamOrUserPage = ({api, currentUserModel, name, ...props}) => (
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
TeamOrUserPage.propTypes = {
  api: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
};

export default function TeamOrUserPagePresenter(application, name) {
  const props = {
    name,
    api: application.api(),
    currentUserModel: application.currentUser(),
    searchUsers: (query) => UserModel.getSearchResultsJSON(application, query).then(users => users.map(user => UserModel(user).asProps())),
    getProjects: (ids) => application.api().get(`projects/byIds?ids=${ids.join(',')}`).then(({data}) => data.map(d => ProjectModel(d).update(d).asProps())),
  };
  const content = Reactlet(TeamOrUserPage, props);
  return LayoutPresenter(application, content);
}