import LayoutPresenter from '../layout';
import SearchPageTemplate from '../../templates/pages/search';

import Categories from "../categories.jsx";
import Reactlet from "../reactlet";
import ProjectsList from "../projects-list.jsx";
import TeamItem from '../team-item.jsx';
import UserItem from '../user-item.jsx';


export default function(application) {

  const self = { 

    application,
    Reactlet,
    searchResultsProjects: application.searchResultsProjects,
    TeamItem,
    UserItem,
    
    searchResultsUsers() {
      const users = application.searchResultsUsers() || [];
      return users.map(user => {
        const props = user.asProps();
        
      });
    }
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
    
    ProjectListPresenter() {
      const props = {
        closeAllPopOvers: application.closeAllPopOvers,
        projects: self.searchResultsProjects().map(project => {
          const props = project.asProps()
          props.users = props.getUsers();
          return props;
        }),
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