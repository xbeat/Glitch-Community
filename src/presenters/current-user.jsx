import React from 'react';

import Observed from './includes/observed.jsx';

const CurrentUserContext = React.createContext('currentUser');

export const CurrentUserProvider = ({model, children}) => (
  <Observed propsObservable={() => model ? model.asProps() : {}} component={user => (
    <CurrentUserContext.Provider value={user}>
      {children}
    </CurrentUserContext.Provider>
  )}/>
);

export const CurrentUserConsumer = CurrentUserContext.Consumer;

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