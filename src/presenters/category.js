
const CategoryTemplate = require("../templates/includes/category");

import ProjectList from "./projects-list.jsx";
import Reactlet from "./reactlet";


module.exports = function(application, category) {
  const self = {

    category,

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
    
    projects() {
      const { projects } = category;
      console.log(projects.map(project => project.asProps()));
      const props = {
        closeAllPopOvers: application.closeAllPopOvers,
        projects: projects.map(project => project.asProps()),
        categoryColor: category.backgroundColor(),
      }
      Reactlet(ProjectList, props);
    }
  };

  return CategoryTemplate(self);
};
