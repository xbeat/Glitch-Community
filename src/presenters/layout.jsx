import React from 'react';
import PropTypes from 'prop-types';

import Header from './header.jsx';
import Footer from './footer.jsx';

const Layout = ({children, api, searchQuery}) => (
  <div className="content">
    <Header api={api} searchQuery={searchQuery}/>
    {children}
    <Footer/>
  </div>
);
Layout.propTypes = {
  api: PropTypes.any.isRequired,
  children: PropTypes.node.isRequired,
  searchQuery: PropTypes.string,
};

export default Layout;