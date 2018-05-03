import IndexTemplate from '../../templates/pages/index';
import LayoutPresenter from '../layout';
import HeaderPresenter from '../header';
import FeaturedCollectionPresenter from '../featured-collection';
import RecentProjectsPresenter from '../recent-projects';
import QuestionsPresenter from '../questions';
import CategoryModel from '../../models/category';
import ProjectModel from '../../models/project';
import Reactlet from '../reactlet';
import EmbedHtml from '../../curated/embed';

import Categories from "../categories.jsx";
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

      const props = {
        isSignedIn() {
          return application.currentUser().isSignedIn();
        },
        showVideoOverlay(event) {
          application.overlayVideoVisible(true);
          document.getElementsByClassName('video-overlay')[0].focus();
          return event.stopPropagation();
        },
      };

      return Reactlet(WhatIsGlitch, props);
    },

    header() {
      return HeaderPresenter(application);
    },

    currentUser: application.currentUser,

    hiddenUnlessCurrentUser() {
      if (!application.currentUser().id()) { return 'hidden'; }
    },

    featuredCollections() {
      return application.featuredCollections.map(collection => FeaturedCollectionPresenter(application, collection));
    },
    
    randomCategories() {
      const props = {
        closeAllPopOvers: application.closeAllPopOvers,
        getCategories: () => CategoryModel.getRandomCategories(application.api()),
      };
      return Reactlet(RandomCategories, props);
    },

    embed() {
      const node = document.createElement('span');
      node.innerHTML = EmbedHtml;
      return node;
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
