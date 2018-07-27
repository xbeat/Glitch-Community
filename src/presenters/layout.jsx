import React from 'react';
import PropTypes from 'prop-types';

import Header from './header.jsx';
import Footer from './footer.jsx';
import Observable from 'o_0';

const getHeaderProps = (application) => {
  const userObservable = Observable(() => {
    const user = application.currentUser();
    const maybeUser = user.fetched() ? user.asProps() : null;
    if (maybeUser) {
      //Invoke any getters we care about
      maybeUser.teams;
    }
    return maybeUser;
  });
  const props = {
    api: application.api(),
    baseUrl: application.normalizedBaseUrl(),
    userObservable: userObservable,
    searchQuery: application.searchQuery(),
    getUserPref: application.getUserPref,
    setUserPref: application.updateUserPrefs,
  };
  return props;
};

const Layout = ({children, application}) => (
  <div className="content">
    <Header {...getHeaderProps(application)}/>
    {children}
    <Footer/>
  </div>
);
Layout.propTypes = {
  application: PropTypes.any.isRequired,
  children: PropTypes.node.isRequired,
};

export default Layout;