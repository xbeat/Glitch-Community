import IndexTemplate from '../../templates/pages/index';
import LayoutPresenter from '../layout';
import FeaturedCollectionPresenter from '../featured-collection';
import RecentProjectsPresenter from '../recent-projects';
import QuestionsPresenter from '../questions';
import CategoryModel from '../../models/category';
import Reactlet from '../reactlet';
import EmbedHtml from '../../curated/embed';
import Observable from 'o_0';

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

    currentUser: application.currentUser,

    hiddenUnlessCurrentUser() {
      if (!application.currentUser().id()) { return 'hidden'; }
    },

    featuredCollections() {
      return application.featuredCollections.map(collection => FeaturedCollectionPresenter(application, collection));
    },
    
    randomCategoriesObservable: Observable([]),
    
    randomCategories() {
      
      const props = {
        closeAllPopOvers: application.closeAllPopOvers,
        categories: self.randomCategoriesObservable().asProps(),
      };
      
      let categoryModels = randomCategoriesObservable().filter(model => !!model.projects.length);
      models = sampleSize(models, 3);
            
      const categories = models.map(categoryModel => {
        const {...category} = categoryModel.asProps();
        category.projects = sampleSize(category.projects, 3);
        return category;
      });
      this.setState({categories});
    });
      
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
  
  CategoryModel.getRandomCategories(application.api()).then(
    (categoryModels) => self.randomCategoriesObservable(categoryModels)
  );

  const content = IndexTemplate(self);

  return LayoutPresenter(application, content);
}
