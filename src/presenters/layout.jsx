import React from 'react';
import PropTypes from 'prop-types';

import {CurrentUserProvider} from './current-user.jsx';
import {Notifications} from './notifications.jsx';

import Header from './header.jsx';
import Footer from './footer.jsx';

const getHeaderProps = (application) => ({
  api: application.api(),
  baseUrl: application.normalizedBaseUrl(),
  getUserPref: application.getUserPref,
  setUserPref: application.updateUserPrefs,
});

const Layout = ({children, application, searchQuery}) => (
  <div className="content">
    <Notifications>
      <CurrentUserProvider model={application.currentUser()}>
        <Header {...getHeaderProps(application)} searchQuery={searchQuery}/>
        {children}
        <Footer/>
      </CurrentUserProvider>
    </Notifications>
  </div>
);
Layout.propTypes = {
  application: PropTypes.any.isRequired,
  children: PropTypes.node.isRequired,
  searchQuery: PropTypes.string,
};

export default Layout;