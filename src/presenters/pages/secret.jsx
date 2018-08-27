import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import {DevTogglesProvider, DevToggles} from '../includes/dev-toggles.jsx';
import {UserPrefsProvider} from '../includes/user-prefs.jsx';

class SecretEffectsOnMount extends React.Component {
  componentDidMount() {
    // Style the body, which is otherwise outside our scope:
    document.body.style.backgroundColor = "black";
    
    
    //try to play the secret sound:
    const audio = new Audio('https://cdn.glitch.com/a5a035b7-e3db-4b07-910a-b5c3ca9d8e86%2Fsecret.mp3?1535396729988');
    audio.play().then( () => {
      // DO-Do Do-do do-dO dO-DO
    }).catch(() => {
      // play() will fail if the user hasn't interacted with the dom yet.
      // s'fine, let it.
    });
  }
  render() {
    return null;
  }
}

const SecretPageContainer = () => { 
  return (
    <UserPrefsProvider>
      <DevTogglesProvider>
        <DevToggles>
          {(enabledToggles, toggles, setEnabledToggles) => (
            <Secret {...{enabledToggles, toggles, setEnabledToggles}}/>
          )}
        </DevToggles>
      </DevTogglesProvider>
    </UserPrefsProvider>
  );
};

const Secret = ({toggles, enabledToggles=[], setEnabledToggles}) => { 
  const toggleTheToggle = (name) => {
    let newToggles = null;
    if(isEnabled(name)) {
      newToggles = enabledToggles.filter(
        (enabledToggleName) => enabledToggleName !== name
      );
    } else {
      newToggles = enabledToggles.concat([name]);
    }
    setEnabledToggles(newToggles);
  };
  
  const isEnabled = (toggleName) => {
    return enabledToggles && enabledToggles.includes(toggleName);
  };
  
  const resetToDefaults = () => {
    // Clear the localstorage set of enabled toggles so we go back to using the defaults.
    setEnabledToggles(undefined);
  };
  
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
  setEnabledToggles: PropTypes.func.isRequired,
};

export default SecretPageContainer;