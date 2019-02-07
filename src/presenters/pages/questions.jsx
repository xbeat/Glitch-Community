import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import Layout from '../layout.jsx';

import Questions from '../questions.jsx';
import MoreIdeas from '../more-ideas';

const QuestionsPage = ({api}) => (
  <Layout api={api}>
    <Helmet>
      <title>Questions</title>
    </Helmet>
    <main className="questions-page">
      <Questions api={api} max={12}/>
      <MoreIdeas api={api}/>
    </main>
  </Layout>
);
QuestionsPage.propTypes = {
  api: PropTypes.any.isRequired,
};

export default QuestionsPage;