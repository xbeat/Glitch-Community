import React from 'react';
import PropTypes from 'prop-types';

import LocalStorage from './local-storage';

const { Provider, Consumer } = React.createContext();

export const UserPrefsProvider = ({ children }) => (
  <LocalStorage name="community-userPrefs" default={{}}>
    {(prefs, set) => <Provider value={{ prefs, set }}>{children}</Provider>}
  </LocalStorage>
);
UserPrefsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const UserPref = ({ children, name, ...props }) => (
  <Consumer>
    {({ prefs, set }) => children(prefs[name] !== undefined ? prefs[name] : props.default, value => set({ ...prefs, [name]: value }))
    }
  </Consumer>
);
UserPref.propTypes = {
  children: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  default: PropTypes.any.isRequired,
};

export default UserPref;
