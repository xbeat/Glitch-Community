import LayoutPresenter from '../layout';
import SearchPageTemplate from '../../templates/pages/search';
import TeamItemPresenter from '../team-item';

import Categories from "../categories.jsx";
import Reactlet from "../reactlet";
import ProjectsList from "../projects-list.jsx";
import UserItem from '../user-item.jsx';


export default function(application) {

  const self = { 

    application,
    Reactlet,
    searchResultsProjects: application.searchResultsProjects,
    searchResultsUsers: application.searchResultsUsers,
    searchResultsTeams: application.searchResultsTeams,
    TeamItemPresenter,
    UserItem,
    
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
    
    ProjectListPresenter() {
      const props = {
        closeAllPopOvers: application.closeAllPopOvers,
        projects: self.searchResultsProjects().map(project => project.asProps()),
        title: "Projects"
      };
      return Reactlet(ProjectsList, props);
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
}