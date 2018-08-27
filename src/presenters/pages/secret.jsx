import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import {UserPrefsProvider, UserPref} from '../includes/user-prefs.jsx';

//
//  Define your dev toggles here.
//  We can only have three.
//
const devToggles = [
  {name: "add-team", description: "The add-team UI", default: true},
  {name: "team-billing", description: "can you pay for teams?.", default: false},
  {name: "fishcakes", description: "opinions on if it's a cake or not", default: true},
].splice(0,3); // <-- Yeah really, only 3.

class SecretEffectsOnMount extends React.Component {
  componentDidMount() {
    document.body.style.backgroundColor = "black";
    
    const audio = new Audio('https://cdn.glitch.com/a5a035b7-e3db-4b07-910a-b5c3ca9d8e86%2Fsecret.mp3?1535396729988');
    try {
      audio.play();
    } catch (exception) {
      // play() will fail if the user hasn't interacted with the dom yet.
      // s'fine, let it.
    }
  }
  render() {
    return null;
  }
}

const SecretPageContainer = () => {
  const defaultToggles = devToggles.filter(
    (toggle) => toggle.default
  ).map(
    ({name}) => name
  );
  
  
  return (
    <UserPrefsProvider>
      <UserPref name="devToggles" default={defaultToggles}>
        {(enabledToggles, set) => (
          <Secret enabledToggles={enabledToggles} toggles={devToggles} setEnabled={set}></Secret>
        )}
      </UserPref>
    </UserPrefsProvider>
  );
};

const Secret = ({toggles, enabledToggles=[], setEnabled}) => { 
  const toggleTheToggle = (name) => {
    let newToggles = null;
    if(isEnabled(name)) {
      newToggles = enabledToggles.filter(
        (enabledToggleName) => enabledToggleName !== name
      );
    } else {
      newToggles = enabledToggles.concat([name]);
    }
    setEnabled(newToggles);
  };
  
  const isEnabled = (toggleName) => {
    return enabledToggles && enabledToggles.includes(toggleName);
  };
  
  const resetToDefaults = () => {
    // Clear the localstorage set of enabled toggles:
    setEnabled(undefined);
  };SecretEffectsOnMount
  
  return (
    <section className="secretPage">
      <Helmet>
        <title>Glitch - It's a secret to everybody.</title>
      </Helmet>
      <SecretEffectsOnMount/>
      <ul>
        {toggles.map(({name, description}) => (
          <li key={name}>
            <button title={description} onClick={() => toggleTheToggle(name)} className={isEnabled(name) ? "lit" : "dark"}>{name}</button>
          </li>
        ))}
      </ul>
      <div className="default"><button onClick={resetToDefaults}>Reset to defaults</button></div>
    </section>
  );
};

Secret.propTypes = {
  toggles: PropTypes.array.isRequired,
  enabledToggles: PropTypes.array.isRequired,
  setEnabled: PropTypes.func.isRequired,
};

export default SecretPageContainer;