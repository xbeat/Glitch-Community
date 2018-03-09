const IndexTemplate = require("../../templates/pages/index");
const LayoutPresenter = require("../layout");
const CtaButtonsPresenter = require("../cta-buttons");
const HeaderPresenter = require("../header");
const FeaturedCollectionPresenter = require("../featured-collection");
const CategoriesPresenter = require ("../categories");
const CategoryPresenter = require ("../category");
const RecentProjectsPresenter = require("../recent-projects");
const QuestionsPresenter = require("../questions");
const Reactlet = require("../../templates/reactlet");

import WhatIsGlitch from "../what-is-glitch.jsx";
import ByFogCreek from "../includes/by-fogcreek.jsx";
import {render, unmountComponentAtNode} from 'react-dom';
import React from 'react';

module.exports = function(application) {
  console.log("Presented index");
  
  const self = {
    application,
    projects: application.projects,
    
    user: application.user,

    WhatIsGlitch() {
      const id = "what-is-glitch";
      setTimeout(() => { 
        return render(
          React.createElement(WhatIsGlitch, null),
          document.getElementById(id)
        );
      });
      return Reactlet({id: id});
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
    
    ByFogCreek() {
      const id = "by-fogcreek";
      setTimeout(() => { 
        return render(
          React.createElement(ByFogCreek, null),
          document.getElementById(id)
        );
      });
      return Reactlet({id: id});
    }
  };

  const content = IndexTemplate(self);

  return LayoutPresenter(application, content);
};
