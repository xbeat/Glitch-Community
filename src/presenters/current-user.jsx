import React from 'react';

import Observable from 'o_0';
import Observed from './includes/observed.jsx';

const {Provider, Consumer} = React.createContext({});

export const CurrentUserConsumer = ({children}) => (
  <Consumer>
    {model => (
      <Observed propsObservable={Observable(() => model.asProps())} component={user => (
        children(user)
      )}/>
    )}
  </Consumer>
);

export const CurrentUserProvider = Provider;

export function normalizeUser(user, currentUser) {
  return user.id === currentUser.id ? currentUser : user;
}

export function normalizeUsers(users, currentUser) {
  return users.map(user => normalizeUser(user, currentUser));
}

export function normalizeProject({users, ...project}, currentUser) {
  return {users: normalizeUsers(users, currentUser), ...project};
}

export function normalizeProjects(projects, currentUser) {
  return projects.map(project => normalizeProject(project, currentUser));
}