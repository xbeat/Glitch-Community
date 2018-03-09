const IndexTemplate = require("../../templates/pages/index");
const LayoutPresenter = require("../layout");
const WhatIsGlitchPresenter = require("../what-is-glitch");
const CtaButtonsPresenter = require("../cta-buttons");
const HeaderPresenter = require("../header");
const FeaturedCollectionPresenter = require("../featured-collection");
const CategoriesPresenter = require ("../categories");
const CategoryPresenter = require ("../category");
const RecentProjectsPresenter = require("../recent-projects");
const QuestionsPresenter = require("../questions");
const ByFogcreek = require("../../templates/includes/by-fogcreek");


module.exports = function(application) {
  console.log("Presented index");
  
  const self = {
    application,
    projects: application.projects,
    
    user: application.user,

    whatIsGlitch() {
      return WhatIsGlitchPresenter(application);
    },

    ctaButtons() {
      return CtaButtonsPresenter(application);
    },

    header() {
      return HeaderPresenter(application);
    },

    currentUser: application.currentUser,
      
    featuredCollections() {
      return application.featuredCollections.map(collection => FeaturedCollectionPresenter(application, collection));
    },

    randomCategories() {
      let categories = application.categories().filter(category => category.hasProjects());
      return categories.map((category) =>CategoryPresenter(application, category));
    },
   
    CategoriesPresenter() {
      return CategoriesPresenter(application);
    },
    
    QuestionsPresenter() {
      return QuestionsPresenter(application);
    },
    
    ByFogcreek() {
      return ByFogcreek(application);
    }
  };

  const content = IndexTemplate(self);

  return LayoutPresenter(application, content);
};
