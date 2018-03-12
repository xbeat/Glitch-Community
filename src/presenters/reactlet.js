// This shim helps attach React components to Jadelet files
// Also see presenters/reactlet.js

const ReactletTemplate = require("../templates/reactlet");

module.exports = function(application, category) {
  const { projects } = category;

  const projectElements = projects.map(project => ProjectItemPresenter(application, project, category));

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
    }
  };
    
  self.projects = projectElements;

  return CategoryTemplate(self);
};
