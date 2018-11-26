import React from 'react';

import Helmet from 'react-helmet';
import Layout from '../layout';

const telescopeImageUrl = 'https://cdn.glitch.com/7138972f-76e1-43f4-8ede-84c3cdd4b40a%2Ftelescope_404.svg?1543258683849';

const NotFoundPage = ({api}) => (
  <div id='page-not-found-container'>
    <img src={telescopeImageUrl} alt='' />
  <section id='page-not-found'>
    test
  </section>
    <Helmet>
      <title>👻 Page not found</title> {/* eslint-disable-line */}
    </Helmet>
  </div>
);

export default NotFoundPage;