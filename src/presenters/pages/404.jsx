import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import ErrorPage from './error.jsx';

const NotFoundPage = () => (
  <>
    <ErrorPage title="Page Not Found" description="Maybe a typo? Or perhaps it's moved?"/>
    <Helmet>
      <title>👻 Page not found</title> {/* eslint-disable-line */}
    </Helmet>
  </>
);

export default NotFoundPage;