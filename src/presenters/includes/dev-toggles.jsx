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


//
//  Dev Toggles!
//
//   Use dev toggles to parts of the site that are still in development.
//   This site is open source, there's no utility here, this is just a way to help us
//   ship things _extra_ early without impacting customer UX
//
/* Usage:

// Import Devtoggles into your scope:
import DevToggles from '../includes/dev-toggles.jsx`


// Use the DevToggles consumer to see what's what,
// Test for a toggle with enabledToggles.includes
<DevToggles>
  {(enabledToggles) => (
    <div>
      { enabledToggles.includes("fishsticks") && <FishSticks/> }
    </div>
  )}
</DevToggles>



*/


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
      enabledToggles||[], toggles, setEnabledToggles
    )}
  </Consumer>
);
DevToggles.propTypes = {
  children: PropTypes.func.isRequired,
};

export default DevToggles;