const ProjectsListTemplate = require("../templates/projects-list");

import Reactlet from "./reactlet";
import ProjectItem from "./project-item.jsx"

module.exports = function(application, title, projects, projectOptions={}) {
  
  const self = {

    sectionTitle: title,

    projects() {
      return projects.map(project => Reactlet(ProjectItem, {closeAllPopovers: application.closeAllPopovers, project: project.asProps(), projectOptions}));
    },

    visibleIfNoPins() {
      if ((title === 'Pinned Projects') && (projects.length === 0)) {
        return 'visible';
      }
    },

    hiddenUnlessTitleIsPinned() {
      if (title !== 'Pinned Projects') { return 'hidden'; }
    },
  };


  return ProjectsListTemplate(self);
};
