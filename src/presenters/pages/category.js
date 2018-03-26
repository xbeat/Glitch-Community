const CategoryPageTemplate = require("../../templates/pages/category");
const LayoutPresenter = require("../layout");
const ProjectItemPresenter = require("../project-item");

const Reactlet = require("../reactlet");

import Categories from "../categories.jsx";
import {render} from 'react-dom';
import React from 'react';

module.exports = function(application) {

    
  var self = {

    application,
    category: application.category,

    projectElements() {
      return self.category().projects().map(project => ProjectItemPresenter(application, project, self.category()));
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

