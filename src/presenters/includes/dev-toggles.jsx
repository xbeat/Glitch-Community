import React from 'react';
import PropTypes from 'prop-types';
import {UserPrefsProvider, UserPref} from '../includes/user-prefs.jsx';


const {Provider, Consumer} = React.createContext();

//
//  Define your dev toggles here.
//  We can only have three.
//
const devToggles = [
  {name: "add-team", description: "The add-team UI", default: true},
  {name: "team-billing", description: "can you pay for teams?.", default: false},
  {name: "fishcakes", description: "opinions on if it's a cake or not", default: true},
].splice(0,3); // <-- Yeah really, only 3.

const defaultToggles = devToggles.filter(
  (toggle) => toggle.default
).map(
  ({name}) => name
);

/*


  <DevTogglesProvider>
    <UserPref name="devToggles" default={defaultToggles}>
      {(enabledToggles, set) => (
        <Secret enabledToggles={enabledToggles} toggles={devToggles} setEnabled={set}></Secret>
      )}
    </UserPref>
  </DevTogglesProvider>
*/

export const DevTogglesProvider = ({children}) => (
  <UserPref name="devToggles" default={defaultToggles}>
      {(enabledToggles, set) => (
        children(enabledToggles, devToggles, set);
      )}
  </UserPref>
  
  <LocalStorage name="community-userPrefs" default={{}}>
    {(prefs, set) => (
      <Provider value={{prefs, set}}>
        {children}
      </Provider>
    )}
  </LocalStorage>
);
DevTogglesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const UserPref = ({children, name, ...props}) => (
  <Consumer>
    {({prefs, set}) => children(
      prefs[name] !== undefined ? prefs[name] : props.default,
      value => set({...prefs, [name]: value})
    )}
  </Consumer>
);
UserPref.propTypes = {
  children: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  default: PropTypes.any.isRequired,
};

export default UserPref;