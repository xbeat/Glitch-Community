const axios = require('axios');

const LayoutPresenter = require("../layout");
const SearchPageTemplate = require("../../templates/pages/search");

import Categories from "../categories.jsx";
import Reactlet from "../reactlet";
import ProjectItem from "../project-item.jsx";


module.exports = function(application) {

  const self = { 

    application,
    searchResultsProjects: application.searchResultsProjects,
    searchResultsUsers: application.searchResultsUsers,
    searchResultsTeams: application.searchResultsTeams,
    
    hiddenIfSearchResultsTeamsLoaded() {
      if (application.searchResultsTeamsLoaded()) { return 'hidden'; }
    },      
    
    hiddenIfSearchResultsProjectsLoaded() {
      if (application.searchResultsProjectsLoaded()) { return 'hidden'; }
    },
  
    hiddenIfSearchResultsUsersLoaded() {
      if (application.searchResultsUsersLoaded()) { return 'hidden'; }
    },
  
    hiddenIfSearchResultsHaveNoUsers() {
      if (application.searchResultsHaveNoUsers()) { return 'hidden'; }
    },

    hiddenIfSearchResultsHaveNoProjects() {
      if (application.searchResultsHaveNoProjects()) { return 'hidden'; }
    },
    
    hiddenIfSearchResultsHaveNoTeams() {
      if (application.searchResultsHaveNoTeams()) { return 'hidden'; }
    },      

    hiddenUnlessSearchHasNoResults() {
      if (!application.searchResultsHaveNoUsers() || !application.searchResultsHaveNoProjects() || !application.searchResultsHaveNoTeams()) { return 'hidden'; }
    },
    
    ProjectItemPresenter(context, project, {}) {
      return Reactlet(ProjectItem, {closeAllPopOvers: context.closeAllPopOvers, project: project.asProps()});
    },
    
    Categories() {
      const props = {
        categories: application.categories,
      };
      return Reactlet(Categories, props);
    },
    
  };
    

  const content = SearchPageTemplate(self);
        
  return LayoutPresenter(application, content);
};