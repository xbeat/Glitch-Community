import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import Layout from '../layout.jsx';

import Questions from '../questions.jsx';
import Categories from '../categories.jsx';

const QuestionsPage = ({application}) => (
  <Layout application={application}>
    <Helmet>
      <title>Questions</title>
    </Helmet>
    <main className="questions-page">
      <Questions api={application.api()} max={12}/>
      <Categories/>
    </main>
  </Layout>
);
QuestionsPage.propTypes = {
  application: PropTypes.any.isRequired,
};

export default QuestionsPage;