const CategoryPageTemplate = require("../../templates/pages/category");
const LayoutPresenter = require("../layout");

import ProjectItem from "../project-item.jsx";
import Categories from "../categories.jsx";
import Reactlet from "../reactlet";

module.exports = function(application) {

    
  var self = {

    application,
    category: application.category,

    projectElements() {
      return self.category().projects().map(project => Reactlet(ProjectItem, application, project, self.category()));
    },

    Categories() {
      const props = {
        categories: application.categories,
      };
      return Reactlet(Categories, props);
    },

    name() {
      return self.category().name();
    },

    avatarUrl() {
      return self.category().avatarUrl();
    },

    description() {
      return self.category().description();
    },

    backgroundColor() {
      return self.category().backgroundColor();
    },

    style() {
      return {backgroundColor: self.backgroundColor()};
    },

    hiddenIfCategoryProjectsLoaded() {
      if (application.categoryProjectsLoaded()) { return 'hidden'; }
    },
  };
    
  const content = CategoryPageTemplate(self);
  return LayoutPresenter(application, content);
};

