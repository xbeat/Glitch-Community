import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import Layout from '../layout.jsx';

const SecretPageContainer = ({api}) => (
  <Secret toggles={{fish: true, cakes: false, fishcakes: false}}></Secret>
);

const Secret = ({toggles}) => {
  
  return (
    <section style={{backgroundColor: "black"}}>
      
      
      
      
    </section>
  );
  
}

export default SecretPageContainer;