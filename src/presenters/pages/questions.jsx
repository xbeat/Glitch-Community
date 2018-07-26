import React from 'react';
import PropTypes from 'prop-types';

import LayoutPresenter from '../layout';
import Reactlet from '../reactlet';

import Questions from '../questions.jsx';
import Categories from '../categories.jsx';

const QuestionsPage = ({api, categories}) => (
  <main className="questions-page">
    <Questions api={api} max={12}/>
    <Categories categories={categories}/>
  </main>
);
QuestionsPage.propTypes = {
  api: PropTypes.any.isRequired,
  categories: PropTypes.array.isRequired,
};

export default function(application) {
  const props = {
    api: application.api(),
    categories: application.categories,
  };
  const content = Reactlet(QuestionsPage, props);
  return LayoutPresenter(application, content);
}