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
    <section style={{backgroundColor: "black"}}>
      
      <ul>
        {toggles.map((toggle) => (
          
        ))}
      </ul>
      
      
    </section>
  );
  
}

export default SecretPageContainer;