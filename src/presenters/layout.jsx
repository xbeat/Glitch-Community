import React from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import Helmet from 'react-helmet';

import Header from './header.jsx';
import Footer from './footer.jsx';
import Konami from './includes/konami.jsx';


const Layout = ({children, api, searchQuery}) => (
  <div className="content">
    <Helmet>
      <title>Glitch - Discover and create the best stuff on the web</title>
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