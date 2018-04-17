const RecentProjectsTemplate = require("../templates/includes/recent-projects");
const Loader = require("../templates/includes/loader");

import {ProjectsUL} from "./projects-list.jsx"
import SignInPop from "./pop-overs/sign-in-pop.jsx";
import Reactlet from "./reactlet";

module.exports = function(application) {

  const self = { 

    application,
    currentUser: application.currentUser(),

    style() {
      return {
        backgroundImage: `url('${application.currentUser().coverUrl('large')}')`,
        backgroundColor: application.currentUser().coverColor(),
      };
    },
    
    userAvatarStyle() {
      return {
        backgroundColor: application.currentUser().color(),
        backgroundImage: `url('${application.currentUser().userAvatarUrl('large')}')`,
      };
    },
    
    userAvatarUrl() {
      return application.currentUser().userAvatarUrl('large');
    },
    
    loader() {
      return Loader(self);
    },
    
    projects() {
      let projects = application.currentUser().projects();
      if (application.currentUser().isAnon()) {
        projects = projects.slice(0,1);
      } else if (application.currentUser().isSignedIn()) {
        projects = projects.slice(0,3);      
      }
      const projectIds = projects.map(project => ({id: project.id()}));
      application.getProjects(projectIds);
      
      if(projects.find(project => !project.fetched())){
        return self.loader();
      }
      
      const props = {
        closeAllPopOvers: application.closeAllPopOvers,
        projects: projects.map(project => project.asProps()),
      }

      return Reactlet(ProjectsUL, props);
    },
        
    SignInPop() {
      return Reactlet(SignInPop);
    },
    
    userAvatarIsAnon() {
      if (application.currentUser().isAnon()) { return 'anon-user-avatar'; }
    },

    toggleSignInPopVisible(event) {
      application.signInPopVisibleOnRecentProjects.toggle();
      return event.stopPropagation();
    },

    hiddenUnlessSignInPopVisible() {
      if (!application.signInPopVisibleOnRecentProjects()) { return 'hidden'; }
    },

    userLink() {
      return application.currentUser().userLink();
    },

    hiddenIfUserIsFetched() {
      if (application.currentUser().fetched()) { return 'hidden'; }
    },

    hiddenUnlessCurrentUser() {
      if (!application.currentUser().id()) { return 'hidden'; }
    },
  };

  return RecentProjectsTemplate(self);
};
