import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import ErrorPage from './error.jsx';

const telescopeImageUrl = 'https://cdn.glitch.com/7138972f-76e1-43f4-8ede-84c3cdd4b40a%2Ftelescope_404.svg?1543258683849';

const NotFoundPage = () => (
  <>
    <img src={telescopeImageUrl} alt='' />
  <div id=''>test</div>
    <Helmet>
      <title>👻 Page not found</title> {/* eslint-disable-line */}
    </Helmet>
  </>
);

export default NotFoundPage;