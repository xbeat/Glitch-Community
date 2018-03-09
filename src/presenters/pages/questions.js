const QuestionsPageTemplate = require("../../templates/pages/questions");
const LayoutPresenter = require("../layout");
const CtaButtonsPresenter = require("../cta-buttons");
const QuestionsPresenter = require("../questions");

const Reactlet = require("../../templates/reactlet");

import Categories from "../categories.jsx";
import {render} from 'react-dom';
import React from 'react';

module.exports = function(application) {
  const self = {

    application,

    ctaButtons() {
      return CtaButtonsPresenter(application);
    },

    questions() {
      return QuestionsPresenter(application, 12);
    },

    Categories() {
      const id = "categories";
      setTimeout(() => { 
        return render(
          React.createElement(Categories, {categories: application.categories()}),
          document.getElementById(id)
        );
      });
      return Reactlet({id: id});
    },
  };
      
  const content = QuestionsPageTemplate(self);

  return LayoutPresenter(application, content);
};
