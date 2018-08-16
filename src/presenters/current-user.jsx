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
    if (analytics && user) {
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

// This takes sharedUser and cachedUser
// sharedUser is stored in localStorage['cachedUser']
// cachedUser is stored in localStorage['community-cachedUser']
// sharedUser syncs with the editor and is authoritative on id and persistentToken
// cachedUser mirrors GET /users/{id} and is used for user name/projects/teams

class CurrentUserManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {fetched: false};
  }
  
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
  
  async load() {
    this.setState({fetched: false});
    const {sharedUser, cachedUser} = this.props;
    if (sharedUser) {
      const {data} = await this.api().get(`users/${sharedUser.id}`);
      this.props.setCachedUser(data);
      this.setState({fetched: true});
      identifyUser(data);
    } else {
      if (cachedUser) {
        this.props.setCachedUser(undefined);
      }
      identifyUser(null);
    }
  }
  
  componentDidMount() {
    const {sharedUser, cachedUser} = this.props;
    if (sharedUser || cachedUser) {
      this.load();
    }
  }
  
  componentDidUpdate(prev) {
    const {sharedUser, cachedUser} = this.props;
    if (!sharedUser && cachedUser) {
      this.props.setCachedUser(undefined);
      this.load();
    } else if (sharedUser && (!prev.sharedUser || !cachedUser || cachedUser.id !== sharedUser.id ||
      cachedUser.persistentToken !== sharedUser.persistentToken
    )) {
      this.props.setCachedUser(sharedUser);
      this.load();
    }
  }
  
  update(changes) {
    const {cachedUser} = this.props;
    this.props.setCachedUser({...cachedUser, ...changes});
  }
  
  clear() {
    this.props.setSharedUser(undefined);
  }
  
  render() {
    const {children, cachedUser} = this.props;
    const {fetched} = this.state;
    return children({
      api: this.api(),
      currentUser: cachedUser,
      fetched,
      update: changes => this.update(changes),
      reload: () => this.load(),
      clear: () => this.clear(),
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
  return UserModel(user).asProps();
};

export const CurrentUserProvider = ({children}) => (
  <LocalStorage name="cachedUser" default={null} ignoreChanges={true}>
    {(sharedUser, setSharedUser, loadedSharedUser) => (
      <LocalStorage name="community-cachedUser" default={null} ignoreChanges={true}>
        {(cachedUser, setCachedUser, loadedCachedUser) => (
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