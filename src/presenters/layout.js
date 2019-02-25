import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import Helmet from 'react-helmet';

import Header from './header';
import Footer from './footer';
import ErrorBoundary from './includes/error-boundary';
import Konami from './includes/konami';

const Layout = ({ children, api, searchQuery }) => (
  <div className="content">
    <Helmet title="Glitch" />
    <Header api={api} searchQuery={searchQuery} />
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
    <Footer />
    <ErrorBoundary fallback={null}>
      <Konami>
        <Redirect to="/secret" push />
      </Konami>
    </ErrorBoundary>
  </div>
);
Layout.propTypes = {
  api: PropTypes.any,
  children: PropTypes.node.isRequired,
  searchQuery: PropTypes.string,
};
Layout.defaultProps = {
  searchQuery: '',
  api: null,
};

export default Layout;
