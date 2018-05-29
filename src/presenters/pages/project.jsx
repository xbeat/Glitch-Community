import React from 'react';
import PropTypes from 'prop-types';

import LayoutPresenter from '../layout';
import Reactlet from '../reactlet';

const ProjectPage = ({}) => (
  <React.Fragment>asdf</React.Fragment>
);

export default function(application) {
  const self = {

    application,

    questions() {
      return QuestionsPresenter(application, 12);
    },

    Categories() {
      const props = {
        categories: application.categories,
      };
     
      return Reactlet(Categories, props);
    },
  };
      
  const content = Reactlet(ProjectPage, {}, 'projectpage');

  return LayoutPresenter(application, content);
}
