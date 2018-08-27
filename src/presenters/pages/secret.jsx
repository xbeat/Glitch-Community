import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import {UserPrefsProvider, UserPref} from '../includes/user-prefs.jsx';

//
//  Define your dev toggles here.
//  We can only have three.
//
const devToggles = [
  {name: "fish", description: "Whether or not fish.", default: true},
  {name: "cakes", description: "Whether or not cakes.", default: false},
  {name: "fishcakes", description: "opinions on if it's a cake or not", default: true},
].splice(0,3); // <-- Yeah really, only 3.

class SetBodyBackground extends React.Component {
  componentDidMount() {
    document.body.style.backgroundColor = this.props.color;
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
  };
  
  return (
    <section className="secretPage">
      <Helmet>
        <title>Glitch -- It's a secret to everybody.</title>
      </Helmet>
      <SetBodyBackground color="black"/>
      <ul>
        {toggles.map(({name, description}) => (
          <li key={name}>
            <button title={description} onClick={() => toggleTheToggle(name)} className={isEnabled(name) ? "lit" : "dark"}>{name}</button>
          </li>
        ))}
      </ul>
      <button className="default" onClick={resetToDefaults}>Reset to defaults</button>
    </section>
  );
};

Secret.propTypes = {
  toggles: PropTypes.array.isRequired,
  enabledToggles: PropTypes.array.isRequired,
  setEnabled: PropTypes.func.isRequired,
};

export default SecretPageContainer;