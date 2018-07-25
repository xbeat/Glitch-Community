import IndexTemplate from '../../templates/pages/index';
import LayoutPresenter from '../layout';
import RecentProjectsPresenter from '../recent-projects';
import QuestionsPresenter from '../questions';
import Reactlet from '../reactlet';

import Categories from "../categories.jsx";
import Featured from '../featured.jsx';
import RandomCategories from '../random-categories.jsx';
import WhatIsGlitch from "../what-is-glitch.jsx";
import ByFogCreek from "../includes/by-fogcreek.jsx";

export default function(application) {
  console.log("Presented index");

  const self = {
    application,
    projects: application.projects,

    user: application.user,

    WhatIsGlitch() {
      if (application.currentUser().isSignedIn()) {
        return null;
      }
      return Reactlet(WhatIsGlitch);
    },

    currentUser: application.currentUser,

    hiddenUnlessCurrentUser() {
      if (!application.currentUser().id()) { return 'hidden'; }
    },

    featured() {
      return Reactlet(Featured);
    },
    
    randomCategories() {
      const props = {
        api: application.api(),
      };
      return Reactlet(RandomCategories, props);
    },

    Categories() {
      const props = {
        categories: application.categories,
      };
      return Reactlet(Categories, props);
    },

    QuestionsPresenter() {
      return QuestionsPresenter(application);
    },

    RecentProjectsPresenter() {
      return RecentProjectsPresenter(application);
    },

    ByFogCreek() {
      return Reactlet(ByFogCreek, null);
    },

  };

  const content = IndexTemplate(self);

  return LayoutPresenter(application, content);
}
