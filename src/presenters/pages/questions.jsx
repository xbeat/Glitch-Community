import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import Layout from '../layout.jsx';
import {ApiConsumer} from '../api.jsx';

import Questions from '../questions.jsx';
import Categories from '../categories.jsx';

const QuestionsPage = ({api, application}) => (
  <Layout application={application}>
    <Helmet>
      <title>Questions</title>
    </Helmet>
    <main className="questions-page">
      <Questions api={api} max={12}/>
      <Categories categories={application.categories}/>
    </main>
  </Layout>
);
QuestionsPage.propTypes = {
  application: PropTypes.any.isRequired,
};

const QuestionsPageContainer = ({application}) => (
  <ApiConsumer>
    {api => <QuestionsPage api={api} application={application}/>}
  </ApiConsumer>
);

export default QuestionsPageContainer;