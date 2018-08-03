import React from 'react';
import PropTypes from 'prop-types';

import Header from './header.jsx';
import Footer from './footer.jsx';

const getHeaderProps = (application) => ({
  api: application.api(),
  getUserPref: application.getUserPref,
  setUserPref: application.updateUserPrefs,
});

const Layout = ({children, application, searchQuery}) => (
  <div className="content">
    <Header {...getHeaderProps(application)} searchQuery={searchQuery}/>
    {children}
    <Footer/>
  </div>
);
Layout.propTypes = {
  application: PropTypes.any.isRequired,
  children: PropTypes.node.isRequired,
  searchQuery: PropTypes.string,
};

export default Layout;