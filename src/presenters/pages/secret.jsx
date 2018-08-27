import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import Layout from '../layout.jsx';
import {UserPrefsProvider, UserPref} from '../includes/user-prefs.jsx';

const SecretPageContainer = ({api}) => {
  const toggles = [
    {name: "fish", description: "Whether or not fish.", enabled: true},
    {name: "cakes", description: "Whether or not cakes.", enabled: false},
    {name: "fishcakes", description: "opinions on if it's a cake or not", enabled: true},
  ];
  
  
  return (
    <UserPrefsProvider>
      <UserPref name="devToggles" default={toggles}>
        {(toggles, set) => (
          <Secret toggles={toggles} updateToggles={set}></Secret>
        )}
      </UserPref>
    </UserPrefsProvider>
  );
};

const Secret = ({toggles, updateToggles}) => { 
  const toggle = (name) => {
    togg
  };
  
  return (
    <section className="secretPage">
      <ul>
        {toggles.map(({name, description, enabled}) => (
          <li key={name}>
            <button onClick={() => toggle(name)} className={enabled ? "lit" : "dark"}>{name}</button>
            <span style={{backgroundColor: "white"}}>I AM {enabled ? "ENABLED" : "a sad panda"}</span>
            <span>{description}</span>
          </li>
        ))}
      </ul>
      
      
    </section>
  );
}

export default SecretPageContainer;