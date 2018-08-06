import React from 'react';
import PropTypes from 'prop-types';

import LocalStorage from './includes/local-storage.jsx';

const {Provider, Consumer} = React.createContext();

export const CurrentUserProvider = ({children}) => (
  <LocalStorage name="cachedUser" default={null}>
    {(currentUser, set) => {
      const fetched = true;
      function update(changes) {
        if (changes) {
          set({...currentUser, ...changes});
        } else {
          set(undefined);
        }
      }
      return <Provider value={{currentUser, fetched, update}}>{children}</Provider>;
    }}
  </LocalStorage>
);
CurrentUserProvider.propTypes = {
  model: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export const CurrentUserConsumer = ({children}) => (
  <Consumer>
    {({currentUser, fetched, update}) => children(currentUser, fetched, update)}
  </Consumer>
);
CurrentUserConsumer.propTypes = {
  children: PropTypes.func.isRequired,
};

export function normalizeUser(user, currentUser) {
  return user.id === (currentUser && currentUser.id) ? currentUser : user;
}

export function normalizeUsers(users, currentUser) {
  return users.map(user => normalizeUser(user, currentUser));
}

export function normalizeProject({users, ...project}, currentUser) {
  return {users: users ? normalizeUsers(users, currentUser) : [], ...project};
}

export function normalizeProjects(projects, currentUser) {
  return projects.map(project => normalizeProject(project, currentUser));
}