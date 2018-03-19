const Observable = require('o_0');

const CtaButtonsTemplate = require("../templates/includes/cta-buttons");
const CtaPopPresenter = require("./pop-overs/cta-pop");
const ProjectModel = require("../models/project");
const Reactlet = require("./reactlet");

import JumpRightIn from "./includes/jump-right-in.jsx";

module.exports = function(application) {

  const self = {

    ctaPop: CtaPopPresenter(application),

    toggleCtaPop() {
      return application.ctaPopVisible.toggle();
    },

    hiddenUnlessIsSignedIn() {
      if (!application.currentUser().isSignedIn()) { return 'hidden'; }
    },
    
    JumpRightIn() {
      const projectIds = [
        'a0fcd798-9ddf-42e5-8205-17158d4bf5bb', // 'hello-express'
        '929980a8-32fc-4ae7-a66f-dddb3ae4912c', // 'hello-webpage'
      ];
      const projects = ProjectModel.getProjectsByIds(application.api(), projectIds);
      const fetchedProjects = projects.filter(project => project.fetched());
      const starterProjects = fetchedProjects.map((project) => {
        const {domain, description, avatar} = project;
        return {
          title: domain(),
          domain: domain(),
          description: description(),
          avatar: avatar(),
          showOverlay() { project.showOverlay(application); }
        } 
      });
      
      return Reactlet(JumpRightIn, {starterProjects});
    }
  };

  return CtaButtonsTemplate(self);
};
