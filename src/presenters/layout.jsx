import React from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';

import Header from './header.jsx';
import Footer from './footer.jsx';
import Konami from './includes/konami.jsx';


const Layout = ({children, api, searchQuery}) => (
  <div className="content">
    <Header api={api} searchQuery={searchQuery}/>
    {children}
    <Footer/>
    <Konami>
      <Redirect to={"/secret"} push={true}/>
    </Konami>
  </div>
);
Layout.propTypes = {
  api: PropTypes.any.isRequired,
  children: PropTypes.node.isRequired,
  searchQuery: PropTypes.string,
};

export default Layout;