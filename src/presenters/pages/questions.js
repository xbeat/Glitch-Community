const QuestionsPageTemplate = require("../../templates/pages/questions");
const LayoutPresenter = require("../layout");
const CtaButtonsPresenter = require("../cta-buttons");
const QuestionsPresenter = require("../questions");
const CategoriesPresenter = require("../categories");

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
      return application.categories();
    }
  };
      
  const content = QuestionsPageTemplate(self);

  return LayoutPresenter(application, content);
};
