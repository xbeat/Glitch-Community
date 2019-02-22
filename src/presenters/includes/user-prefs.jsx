import React from 'react';
import PropTypes from 'prop-types';

import useLocalStorage from './local-storage';

const Context = React.createContext();

export const UserPrefsProvider = ({ children }) => {
  const [prefs, set] = useLocalStorage('community-userPrefs', {});
  return (
    <Context.Provider value={{ prefs, set }}>
      {children}
    </Context.Provider>
  );
};
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

const useUserPref = (name, defaultValue) => {
  const { prefs, set } = React.useContext(Context);
  const 
};

export default useUserPref;
