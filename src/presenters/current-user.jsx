/* globals API_URL Raven */

import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

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
    if (!!currentUser !== !!prev.currentUser) {
      this.load();
    } else if (currentUser && currentUser.persistentToken !== prev.currentUser.persistentToken) {
      this.load();
    }
  }
  
  async update(changes) {
    const {currentUser, setCurrentUser} = this.props;
    if (changes) {
      setCurrentUser({...currentUser, ...changes});
    } else if (changes === null) {
      setCurrentUser(undefined);
    } else {
      this.load();
    }
  }
  
  render() {
    const {children, currentUser} = this.props;
    const {fetched} = this.state;
    return children(this.api(), currentUser, fetched, changes => this.update(changes));
  }
}

export const CurrentUserProvider = ({children}) => (
  <LocalStorage name="cachedUser" default={null}>
    {(currentUser, set) => (
      <CurrentUserManager currentUser={currentUser} setCurrentUser={set}>
        {(api, currentUser, fetched, update) => (
          <Provider value={{currentUser, fetched, update}}>
            {children(api)}
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