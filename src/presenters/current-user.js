/* globals API_URL */

import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import {
  configureScope,
  captureException,
  captureMessage,
  addBreadcrumb,
} from '../utils/sentry';
import useLocalStorage from './includes/local-storage';

const Context = React.createContext();

// Default values for all of the user fields we need you to have
// We always generate a 'real' anon user, but use this until we do
const defaultUser = {
  id: 0,
  login: null,
  name: null,
  description: '',
  color: '#aaa',
  avatarUrl: null,
  avatarThumbnailUrl: null,
  hasCoverImage: false,
  coverColor: null,
  emails: [],
  features: [],
  projects: [],
  teams: [],
  collections: [],
};

function identifyUser(user) {
  const analytics = { window };
  if (user) {
    addBreadcrumb({
      level: 'info',
      message: `Current user is ${JSON.stringify(user)}`,
    });
  } else {
    addBreadcrumb({
      level: 'info',
      message: 'logged out',
    });
  }
  try {
    if (analytics && analytics.identify && user && user.login) {
      const emailObj = Array.isArray(user.emails) && user.emails.find(email => email.primary);
      const email = emailObj && emailObj.email;
      analytics.identify(
        user.id,
        {
          name: user.name,
          login: user.login,
          email,
          created_at: user.createdAt,
        },
        { groupId: '0' },
      );
    }
    if (user) {
      configureScope((scope) => {
        scope.setUser({
          id: user.id,
          login: user.login,
        });
      });
    } else {
      configureScope((scope) => {
        scope.setUser({
          id: null,
          login: null,
        });
      });
    }
  } catch (error) {
    console.error(error);
    captureException(error);
  }
}

// Test if two user objects reference the same person
function usersMatch(a, b) {
  if (a && b && a.id === b.id && a.persistentToken === b.persistentToken) {
    return true;
  }
  if (!a && !b) {
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
  constructor(props) {
    super(props);
    this.state = {
      fetched: false, // Set true on first complete load
      working: false, // Used to prevent simultaneous loading
    };
  }

  componentDidMount() {
    identifyUser(this.props.cachedUser);
    this.load();
  }

  componentDidUpdate(prev) {
    const { cachedUser, sharedUser } = this.props;

    if (!usersMatch(cachedUser, prev.cachedUser)) {
      identifyUser(cachedUser);
    }

    if (
      !usersMatch(cachedUser, sharedUser)
      || !usersMatch(sharedUser, prev.sharedUser)
    ) {
      this.load();
    }

    // hooks for easier debugging
    window.currentUser = cachedUser;
    window.api = this.api();
  }

  async getSharedUser() {
    try {
      const {
        data: { user },
      } = await this.api().get('boot?latestProjectOnly=true');
      return user;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return undefined;
      }
      throw error;
    }
  }

  async getCachedUser() {
    const { sharedUser } = this.props;
    if (!sharedUser) return undefined;
    if (!sharedUser.id || !sharedUser.persistentToken) return 'error';
    try {
      const { data } = await this.api().get(`users/${sharedUser.id}`);
      if (!usersMatch(sharedUser, data)) {
        return 'error';
      }
      return data;
    } catch (error) {
      if (
        error.response
        && (error.response.status === 401 || error.response.status === 404)
      ) {
        // 401 means our token is bad, 404 means the user doesn't exist
        return 'error';
      }
      throw error;
    }
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
    if (this.state.working) return;
    this.setState({ working: true });
    const { sharedUser, cachedUser } = this.props;
    console.log(sharedUser, cachedUser);
    if (!usersMatch(sharedUser, cachedUser)) {
      this.props.setCachedUser(undefined);
    }
    if (sharedUser) {
      const newCachedUser = await this.getCachedUser();
      if (newCachedUser === 'error') {
        // Sounds like our shared user is bad
        // Fix it and componentDidUpdate will reload
        this.setState({ fetched: false });
        const newSharedUser = await this.getSharedUser();
        this.props.setSharedUser(newSharedUser);
        console.log(`Fixed shared cachedUser from ${sharedUser && sharedUser.id} to ${newSharedUser && newSharedUser.id}`);
        addBreadcrumb({
          level: 'info',
          message: `Fixed shared cachedUser. Was ${JSON.stringify(sharedUser)}`,
        });
        addBreadcrumb({
          level: 'info',
          message: `New shared cachedUser: ${JSON.stringify(newSharedUser)}`,
        });
        captureMessage('Invalid cachedUser');
      } else {
        this.props.setCachedUser(newCachedUser);
        this.setState({ fetched: true });
      }
    } else {
      const { data } = await this.api().post('users/anon');
      this.props.setSharedUser(data);
    }
    this.setState({ working: false });
  }

  render() {
    const {
      children,
      sharedUser,
      cachedUser,
      setSharedUser,
      setCachedUser,
    } = this.props;
    return children({
      api: this.api(),
      currentUser: { ...defaultUser, ...sharedUser, ...cachedUser },
      fetched: !!cachedUser && this.state.fetched,
      reload: () => this.load(),
      login: user => setSharedUser(user),
      update: changes => setCachedUser({ ...cachedUser, ...changes }),
      clear: () => setSharedUser(undefined),
    });
  }
}
CurrentUserManager.propTypes = {
  sharedUser: PropTypes.shape({
    id: PropTypes.number,
    persistentToken: PropTypes.string,
  }),
  cachedUser: PropTypes.object,
  setSharedUser: PropTypes.func.isRequired,
  setCachedUser: PropTypes.func.isRequired,
};

CurrentUserManager.defaultProps = {
  cachedUser: null,
  sharedUser: null,
};

export const CurrentUserProvider = ({ children }) => {
  const [cachedUser, setCachedUser] = useLocalStorage('community-cachedUser', null);
  const [sharedUser, setSharedUser] = useLocalStorage('cachedUser', null);
  return (
    <CurrentUserManager sharedUser={sharedUser} setSharedUser={setSharedUser} cachedUser={cachedUser} setCachedUser={setCachedUser}>
      {({ api, ...props }) => (
        <Context.Provider value={props}>
          {children(api)}
        </Context.Provider>
      )}
    </CurrentUserManager>
  );
};
CurrentUserProvider.propTypes = {
  children: PropTypes.func.isRequired,
};

export const CurrentUserConsumer = props => (
  <Context.Consumer>
    {({ currentUser, fetched, ...funcs }) => props.children(currentUser, fetched, funcs, props)}
  </Context.Consumer>
);
CurrentUserConsumer.propTypes = {
  children: PropTypes.func.isRequired,
};

export const useCurrentUser = () => React.useContext(Context);

export function normalizeUser(user, currentUser) {
  return user.id === (currentUser && currentUser.id) ? currentUser : user;
}

export function normalizeUsers(users, currentUser) {
  return users.map(user => normalizeUser(user, currentUser));
}

export function normalizeProject({ users, ...project }, currentUser) {
  return { users: users ? normalizeUsers(users, currentUser) : [], ...project };
}

export function normalizeProjects(projects, currentUser) {
  return projects.map(project => normalizeProject(project, currentUser));
}
