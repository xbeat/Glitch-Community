import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import Layout from '../layout.jsx';

const SecretPageContainer = ({api}) => {
  const toggles = [
    {name: "fish", description: "Whether or not fish.", enabled: true},
    {name: "cakes", description: "Whether or not cakes.", enabled: false},
    {name: "fishcakes", description: "opinions on if it's a cake or not", enabled: true},
  ];
  
  
  return (
    <Secret toggles={toggles}></Secret>
  );
};

const Secret = ({toggles}) => { 
  return (
    <section className="secretPage">
      
      <ul>
        {toggles.map(({name, description, enabled}) => (
          <li>
            <button className={enabled ? "lit" : "dark"}>{name}</button>
            <span>{description}</span>
          </li>
        ))}
      </ul>
      
      
    </section>
  );
  
}

export default SecretPageContainer;