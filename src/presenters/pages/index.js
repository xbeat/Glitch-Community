const IndexTemplate = require("../../templates/pages/index");
const LayoutPresenter = require("../layout");
const HeaderPresenter = require("../header");
const FeaturedCollectionPresenter = require("../featured-collection");
const RecentProjectsPresenter = require("../recent-projects");
const QuestionsPresenter = require("../questions");
const CategoryPresenter = require("../category");
const CategoryModel = require("../../models/category");
const ProjectModel = require("../../models/project");
const Reactlet = require("../reactlet");
const Observable = require('o_0');
const EmbedHtml = require('../../curated/embed');

import Categories from "../categories.jsx";
import WhatIsGlitch from "../what-is-glitch.jsx";
import ByFogCreek from "../includes/by-fogcreek.jsx";

module.exports = function(application) {
  console.log("Presented index");
  
  const self = {
    application,
    projects: application.projects,
    
    user: application.user,

    WhatIsGlitch() {
      
      const props = {
        isSignedIn() {
          return application.currentUser().isSignedIn()
        },
        showVideoOverlay(event) {
          application.overlayVideoVisible(true);
          document.getElementsByClassName('video-overlay')[0].focus();
          return event.stopPropagation();
        },
      }

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
    
    randomCategoriesObservable: Observable([]),

    randomCategories() {
      
      if(!self.randomCategoriesObservable.length) {
        self.randomCategoriesObservable(application.categories.map((category) => CategoryModel(category)));
      
        CategoryModel.getRandomCategories(application.api()).then((categories) => 
          self.randomCategoriesObservable(categories.filter(category => category.projects && category.projects.length))
        );
      }
      
      return self.randomCategoriesObservable.map((categoryModel) =>CategoryPresenter(application, categoryModel));
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
    }
  };

  const content = IndexTemplate(self);

  return LayoutPresenter(application, content);
};
