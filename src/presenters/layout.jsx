import React from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import Helmet from 'react-helmet';

import Header from './header.jsx';
import Footer from './footer.jsx';
import ErrorBoundary 
import Konami from './includes/konami.jsx';


const Layout = ({children, api, searchQuery}) => (
  <div className="content">
    <Helmet>
      <title>Glitch</title>
    </Helmet>
    <Header api={api} searchQuery={searchQuery}/>
    {children}
    <Footer/>
    <Konami>
      <Redirect to="/secret" push={true}/>
    </Konami>
  </div>
);
Layout.propTypes = {
  api: PropTypes.any.isRequired,
  children: PropTypes.node.isRequired,
  searchQuery: PropTypes.string,
};

export default Layout;