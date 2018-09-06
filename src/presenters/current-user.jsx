/* globals API_URL Raven */

import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import UserModel from '../models/user';
import LocalStorage from './includes/local-storage.jsx';

const {Provider, Consumer} = React.createContext();

function identifyUser(user) {
  if (user) {
    console.log("👀 current user is", user);
    console.log("🌈 login", user.login);
  } else {
    console.log("👻 logged out");
  }
  try {
    const analytics = window.analytics;
    if (analytics && user && user.login) {
      analytics.identify(user.id, {
        name: user.name,
        login: user.login,
        email: user.email,
        created_at: user.createdAt,
      });
    }
    if (window.Raven) {
      if (user) {
        Raven.setUserContext({
          id: user.id,
          login: user.login,
        });
      } else {
        Raven.setUserContext();
      }
    }
  } catch (error) {
    console.error(error);
    Raven.captureException(error);
  }
}

// Test if two user objects reference the same person
function usersMatch(a, b) {
  if (a && b && a.id === b.id && a.persistentToken === b.persistentToken) {
    return true;
  } else if (!a && !b) {
    return true;
  }
  return false;
}

// This takes sharedUser and cachedUser
// sharedUser is stored in localStorage['cachedUser']
// cachedUser is stored in localStorage['community-cachedUser']
// sharedUser syncs with the editor and is authoritative on id and persistentToken
// cachedUser mirrors GET /users/{id} and is what we actually display

class CurrentUserManager extends React.Component {
  api() {
    if (this.props.sharedUser) {
      return axios.create({
        baseURL: API_URL,
        headers: {
          Authorization: this.props.sharedUser.persistentToken,
        },
      });
    } 
    return axios.create({
      baseURL: API_URL,
    });
  }
  
  async fix() {
    // The token isn't working, or the id doesn't match the token
    // So hit boot and get the right user for our token
    try {
      const {data: {user}} = await this.api().get(`boot?latestProjectOnly=true`);
      this.props.setSharedUser(user);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        this.props.setSharedUser(undefined);
      } else {
        throw error;
      }
    }
  }
  
  async load() {
    const {sharedUser, cachedUser} = this.props;
    if (cachedUser && !usersMatch(sharedUser, cachedUser)) {
      this.props.setCachedUser(undefined);
    }
    if (sharedUser) {
      try {
        const {data} = await this.api().get(`users/${sharedUser.id}`);
        if (usersMatch(sharedUser, data)) {
          this.props.setCachedUser(data);
          identifyUser(data);
        } else {
          this.fix();
        }
      } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 404)) {
          // 401 means our token is bad, 404 means the user doesn't exist
          this.fix();
        } else {
          throw error;
        }
      }
    } else {
      identifyUser(null);
    }
  }
  
  componentDidMount() {
    this.load();
  }
  
  componentDidUpdate(prev) {
    const {sharedUser, cachedUser} = this.props;
    if (!usersMatch(sharedUser, cachedUser) || !usersMatch(sharedUser, prev.sharedUser)) {
      this.load();
    }
    
    // hooks for easier debugging
    window.currentUser = cachedUser;
    window.api = this.api();
  }
  
  render() {
    const {children, sharedUser, cachedUser, setSharedUser, setCachedUser} = this.props;
    const currentUser = cachedUser || sharedUser;
    return children({
      api: this.api(),
      currentUser: currentUser ? UserModel(currentUser).asProps() : null,
      fetched: !!cachedUser,
      reload: () => this.load(),
      login: user => setSharedUser(user),
      update: changes => setCachedUser({...cachedUser, ...changes}),
      clear: () => setSharedUser(undefined),
    });
  }
}
CurrentUserManager.propTypes = {
  sharedUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    persistentToken: PropTypes.string.isRequired,
  }),
  setSharedUser: PropTypes.func.isRequired,
  cachedUser: PropTypes.object,
  setCachedUser: PropTypes.func.isRequired,
};

const cleanUser = (user) => {
  if (!user) {
    return null;
  }
  if (!(user.id > 0) || !user.persistentToken) {
    console.error('invalid cachedUser', user);
    Raven.captureMessage("Invalid cachedUser", {extra: {user}});
    return null;
  }
  return user;
};

export const CurrentUserProvider = ({children}) => (
  <LocalStorage name="community-cachedUser" default={null}>
    {(cachedUser, setCachedUser, loadedCachedUser) => (
      <LocalStorage name="cachedUser" default={null}>
        {(sharedUser, setSharedUser, loadedSharedUser) => (
          <CurrentUserManager sharedUser={cleanUser(sharedUser)} setSharedUser={setSharedUser} cachedUser={cachedUser} setCachedUser={setCachedUser}>
            {({api, ...props}) => (
              <Provider value={props}>
                {loadedSharedUser && loadedCachedUser && children(api)}
              </Provider>
            )}
          </CurrentUserManager>
        )}
      </LocalStorage>
    )}
  </LocalStorage>
);
CurrentUserProvider.propTypes = {
  children: PropTypes.func.isRequired,
};

export const CurrentUserConsumer = ({children}) => (
  <Consumer>
    {({currentUser, fetched, ...funcs}) => children(currentUser, fetched, funcs)}
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