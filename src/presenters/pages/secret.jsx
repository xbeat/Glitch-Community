import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import {DevToggles} from '../includes/dev-toggles.jsx';

class SecretEffectsOnMount extends React.Component {
  componentDidMount() {    
    //try to play the secret sound:
    const audio = new Audio('https://cdn.glitch.com/a5a035b7-e3db-4b07-910a-b5c3ca9d8e86%2Fsecret.mp3?1535396729988');
    const maybePromise = audio.play();

    // Chrome returns a promise which we must handle:
    maybePromise && maybePromise.then( () => {
      // DO-Do Do-do do-dO dO-DO
    }).catch(() => {
      // This empty catch block prevents an exception from bubbling up.
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
    <DevToggles>
      {(enabledToggles, toggleData, setEnabledToggles) => (
        <Secret {...{enabledToggles, toggleData, setEnabledToggles}}/>
      )}
    </DevToggles>
  );
};

const Secret = ({enabledToggles, toggleData, setEnabledToggles}) => { 
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
  
  return (
    <section className="secretPage">
      <div className="filler"></div>
      <Helmet>
        <title>Glitch - It's a secret to everybody.</title>
      </Helmet>
      <SecretEffectsOnMount/>
      <ul>
        {toggleData.map(({name, description}) => (
          <li key={name}>
            <button title={description} onClick={() => toggleTheToggle(name)} className={isEnabled(name) ? "lit" : "dark"}>{name}</button>
          </li>
        ))}
      </ul>
    </section>
  );
};

Secret.propTypes = {
  toggleData: PropTypes.array.isRequired,
  enabledToggles: PropTypes.array.isRequired,
  setEnabledToggles: PropTypes.func.isRequired,
};

export default SecretPageContainer;