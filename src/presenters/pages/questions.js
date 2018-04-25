const QuestionsPageTemplate = require("../../templates/pages/questions");
const LayoutPresenter = require("../layout");
const QuestionsPresenter = require("../questions");

const Reactlet = require("../reactlet");

import Categories from "../categories.jsx";

module.exports = function(application) {
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
      
  const content = QuestionsPageTemplate(self);

  return LayoutPresenter(application, content);
};
