/* globals API_URL Raven */

import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import UserModel from '../models/user';
import LocalStorage from './includes/local-storage.jsx';

const {Provider, Consumer} = React.createContext();

function identifyUser(user) {
  const analytics = window.analytics;
  if (analytics && user) {
    console.log("👻 current user is", user);
    console.log("🌈 login", user.login);
    try {
      analytics.identify(user.id, {
        name: user.name,
        login: user.login,
        email: user.email,
        created_at: user.createdAt,
      });
    } catch (error) {
      console.error(error);
      Raven.captureException(error);
    }
  }
}

class CurrentUserManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {fetched: false};
  }
  
  api() {
    const token = this.props.currentUser && this.props.currentUser.persistentToken;
    if (token) {
      return axios.create({
        baseURL: API_URL,
        headers: {
          Authorization: token,
        },
      });
    } 
    return axios.create({
      baseURL: API_URL,
    });
  }
  
  async load() {
    this.setState({fetched: false});
    const {currentUser, setCurrentUser} = this.props;
    if (currentUser && currentUser.persistentToken) {
      const {data} = await this.api().get(`users/${currentUser.id}`);
      setCurrentUser(data);
      identifyUser(currentUser);
      this.setState({fetched: true});
    }
  }
  
  componentDidMount() {
    this.load();
  }
  
  componentDidUpdate(prev) {
    const {currentUser} = this.props;
    const prevUser = prev.currentUser;
    if (!currentUser && prevUser) {
      this.load();
    } else if (currentUser && (!prevUser || currentUser.id !== prevUser.id ||
      currentUser.persistentToken !== prevUser.persistentToken
    )) {
      this.load();
    }
  }
  
  render() {
    const {children, currentUser, setCurrentUser} = this.props;
    const {fetched} = this.state;
    return children({
      api: this.api(),
      currentUser, fetched,
      update: changes => setCurrentUser({...currentUser, ...changes}),
      reload: () => this.load(),
      clear: () => setCurrentUser(undefined),
    });
  }
}

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
  <LocalStorage name="cachedUser" default={null}>
    {(currentUser, set, loaded) => (
      <CurrentUserManager currentUser={cleanUser(currentUser)} setCurrentUser={set}>
        {({api, ...props}) => (
          <Provider value={props}>
            {loaded && children(api)}
          </Provider>
        )}
      </CurrentUserManager>
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