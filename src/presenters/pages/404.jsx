import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import Layout from '../layout';

const telescopeImageUrl = 'https://cdn.glitch.com/7138972f-76e1-43f4-8ede-84c3cdd4b40a%2Ftelescope_404.svg?1543258683849';

const NotFoundPage = ({api}) => (
  <Layout api={api}>
    <Helmet>
      <title>👻 Page not found</title> {/* eslint-disable-line */}
    </Helmet>
    
    <main id='page-not-found-container'>
        <img id="fallback-img" src={telescopeImageUrl} alt='' />
        <div className="error-msg">
          <h1>Page Not Found</h1>
          <p>Maybe a typo, or perhaps it's moved?</p>
          <a className="button" href="/">Back to Glitch</a>
        </div>
    </main>
  </Layout>
);

NotFoundPage.propTypes = {
  api: PropTypes.func.isRequired,
};

export default NotFoundPage;