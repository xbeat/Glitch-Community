import React from 'react';
import PropTypes from 'prop-types';
import useUserPref from './user-prefs';

const Context = React.createContext();

//  Dev Toggles!
//
//   Use dev toggles to parts of the site that are still in development.
//   This site is open source, there's no utility here, this is just a way to help us
//   ship things _extra_ early without impacting customer UX
//

// Define your dev toggles here.
// We can only have three.
// Users can enable them with the /secret page.
const toggleData = [
  {
    name: 'Email Invites',
    description: 'Enables invite-by-email behavior on the team page.',
  },
  { name: 'Everybody Dance!', description: 'Placeholder for a new toggle.' },
  {
    name: 'Inflatable Crocodiles',
    description: "I don't think this does anything yet.",
  },
].splice(0, 3); // <-- Yeah really, only 3.  If you need more, clean up one first.

// Usage:
// Import Devtoggles into your scope:

// import DevToggles from '../includes/dev-toggles`
// Use the DevToggles from inside of a DevTogglesProvider
// (Which in turn must be inside of a UserPrefProvider,
// both of which are provided by the Client)

// Fetch the array enabledToggles and test for features with [].includes:
/*
  <DevToggles>
    {(enabledToggles) => (
      <div> I could sure go for some:
        { enabledToggles.includes("fishsticks") && <FishSticks/> }
      </div>
    )}
  </DevToggles>
*/

export const DevTogglesProvider = ({ children }) => {
  const [enabledToggles, setEnabledToggles] = useUserPref('devToggles', []);
  return (
    <Context.Provider value={{ enabledToggles, toggleData, setEnabledToggles }}>
      {children}
    </Context.Provider>
  );
};
DevTogglesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useDevToggles = () => {
  return React.useContext(Context);
};
const useDevToggle = () => {
  const {

const DevToggles = ({ children }) => {
  const { enabledToggles, toggleData, setEnabledToggles } = useDevToggles;
  return children(enabledToggles, toggleData, setEnabledToggles);
};
DevToggles.propTypes = {
  children: PropTypes.func.isRequired,
};

export default DevToggles;
