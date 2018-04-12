
const CategoryTemplate = require("../templates/includes/category");

import {ProjectsUL} from "./projects-list.jsx";
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
      if(!projects.length) {
        return;
      }
      const props = {
        closeAllPopOvers: application.closeAllPopOvers,
        projects: [],//projects.map(project => project.asProps()),
        categoryColor: category.backgroundColor(),
      }
      console.log(props.projects, props.projects.filter((project) => !project.description));
      Reactlet(ProjectsUL, props);
    }
  };

  return CategoryTemplate(self);
};
