import React from 'react';
import PropTypes from 'prop-types';
import {UserPrefsProvider, UserPref} from '../includes/user-prefs.jsx';


const {Provider, Consumer} = React.createContext();

//
//  Define your dev toggles here.
//  We can only have three.
//
const toggles = [
  {name: "add-team", description: "The add-team UI", default: true},
  {name: "team-billing", description: "can you pay for teams?.", default: false},
  {name: "fishcakes", description: "opinions on if it's a cake or not", default: true},
].splice(0,3); // <-- Yeah really, only 3.

const defaultToggles = toggles.filter(
  (toggle) => toggle.default
).map(
  ({name}) => name
);

export const DevTogglesProvider = ({children}) => (
  <UserPref name="devToggles" default={defaultToggles}>
      {(enabledToggles, setEnabledToggles) => (
        <Provider value={{enabledToggles, toggles, setEnabledToggles}}>
          {children}
        </Provider>
      )}
  </UserPref>
);
DevTogglesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const DevToggles = ({children}) => (
  <Consumer>
    {({enabledToggles, toggles, setEnabledToggles}) => children(
      enabledToggles, toggles, setEnabledToggles
    )}
  </Consumer>
);
DevToggles.propTypes = {
  children: PropTypes.func.isRequired,
};

export default DevToggles;