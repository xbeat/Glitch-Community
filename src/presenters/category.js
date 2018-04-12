
const CategoryTemplate = require("../templates/includes/category");

import ProjectItem from "./project-item.jsx";
import Reactlet from "./reactlet";


module.exports = function(application, category) {
  const { projects } = category;

  const projectElements = projects.map(project => 
    Reactlet(ProjectItem, {
      closeAllPopOvers: application.closeAllPopOvers,
      project: project.asProps(),
      categoryColor: category.backgroundColor(),
    }));

  const self = {

    category,
    projects,

    style() {
      return {backgroundColor: category.backgroundColor()};
    },

    url() {
      return category.url();
    },

    name() {
      return category.name();
    },
    
    description() {
      return category.description();
    },
  };
    
  self.projects = projectElements;

  return CategoryTemplate(self);
};
