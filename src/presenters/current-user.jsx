import React from 'react';
import PropTypes from 'prop-types';

import LocalStorage from './includes/local-storage.jsx';

const {Provider, Consumer} = React.createContext();

function identifyUser(user) {
  const analytics = window.analytics;
  if (analytics && user.id) {
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
  
  async load() {
    const {api, currentUser, setCurrentUser} = this.props;
    if (currentUser) {
      this.setState({fetched: false});
      const {data} = await api.get(`users/${currentUser.id}`);
      setCurrentUser(data);
      identifyUser(currentUser);
    }
    this.setState({fetched: true});
  }
  
  componentDidUpdate(prev) {
    const {currentUser} = this.props;
    if (!!currentUser !== !!prev.currentUser) {
      this.load();
    } else if (currentUser && currentUser.id !== prev.currentUser.id) {
      this.load();
    }
  }
  
  async update(changes) {
    const {api, currentUser, setCurrentUser} = this.props;
    if (changes) {
      setCurrentUser({...currentUser, ...changes});
    } else if (changes === null) {
      setCurrentUser(undefined);
    } else if (currentUser) {
      const {data} = await api.get(`users/${currentUser.id}`);
      setCurrentUser(data);
    }
  }
  
  render() {
    const {children, currentUser} = this.props;
    const {fetched} = this.state;
    return children(currentUser, fetched, changes => this.update(changes));
  }
}

export const CurrentUserProvider = ({api, children}) => (
  <LocalStorage name="cachedUser" default={null}>
    {(currentUser, set) => (
      <CurrentUserManager api={api} currentUser={currentUser} setCurrentUser={set}>
        {(currentUser, fetched, update) => (
          <Provider value={{currentUser, fetched, update}}>
            {children}
          </Provider>
        )}
      </CurrentUserManager>
    )}
  </LocalStorage>
);
CurrentUserProvider.propTypes = {
  api: PropTypes.any.isRequired,
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