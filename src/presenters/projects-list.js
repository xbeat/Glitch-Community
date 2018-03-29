const ProjectItemPresenter = require("./project-item");
const ProjectsListTemplate = require("../templates/projects-list");

module.exports = function(application, title, projects, projectOptions={}) {
  
  const self = {

    sectionTitle: title,

    projects() {
      return projects.map(project => ProjectItemPresenter(application, project, {}, projectOptions));
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
