import React from 'react';
import PropTypes from 'prop-types';

import LayoutPresenter from '../layout';
import Reactlet from "../reactlet";
import SearchPageTemplate from '../../templates/pages/search';

import Categories from "../categories.jsx";
import ProjectsList from "../projects-list.jsx";
import TeamItem from '../team-item.jsx';
import UserItem from '../user-item.jsx';
import Loader from '../includes/loader.jsx';
import NotFound from '../includes/not-found.jsx';


function old(application) {

  const self = { 

    application,
    Reactlet,
    searchResultsProjects: application.searchResultsProjects,
    searchResultsUsers: application.searchResultsUsers,
    searchResultsTeams: application.searchResultsTeams,
    TeamItem,
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
    
  };
    

  const content = SearchPageTemplate(self);
        
  return LayoutPresenter(application, content);
}

const SearchLoader = ({name}) => (
  <article>
    <h2>{name}</h2>
    <Loader/>
  </article>
);

const SearchTeams = ({results}) => (
  results ? (
    results.length && (
      <article>
        <h2>Teams</h2>
      </article>
    )
  ) : <SearchLoader name="Teams"/>
);

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: null,
      users: null,
      projects: null,
    };
  }
  
  async loadTeams() {
  const MAX_RESULTS = 20;
  const searchPath = `teams/search?q=${query}`;
  return application.api(source).get(searchPath)
    .then(function({data}) {
      application.searchingForTeams(false);
      data = data.slice(0 , MAX_RESULTS);
      if (data.length === 0) {
        application.searchResultsHaveNoTeams(true);
      }
      return data.forEach(function(datum) {
        datum.fetched = true;
        return Team(datum).update(datum).pushSearchResult(application);
      });}).catch(error => console.log('getSearchResults', error));
  }
  
  componentDidMount() {
    console.log(this.props.query);
  }
  
  render() {
    const results = [
      <SearchTeams key="teams" results={this.state.teams}/>
    ].filter(res => !!res);
    return (
      <React.Fragment>
        <main className="search-results">
          {results.length ? results : <NotFound name="any results"/>}
        </main>
        <Categories categories={this.props.categories}/>
      </React.Fragment>
    );
  }
}
SearchPage.propTypes = {
  api: PropTypes.any.isRequired,
  categories: PropTypes.array.isRequired,
  query: PropTypes.string.isRequired,
};
/*

const SearchPage = props => (
  <main className="search-results">

  article(class=@hiddenIfSearchResultsHaveNoTeams)
    h2 Teams
    ul.teams-container
      - @searchResultsTeams().forEach (team) ->
        li
          = Reactlet(TeamItem, {team: team.asProps()}, 'search-team-'+team.id())
    span(class=@hiddenIfSearchResultsTeamsLoaded)
      = Loader(this)


  article(class=@hiddenIfSearchResultsHaveNoUsers)
    h2 Users
    ul.users-container
      - @searchResultsUsers().forEach (user) ->
        li
          = Reactlet(UserItem, {user: user.asProps()}, 'search-user-'+user.id())
    span(class=@hiddenIfSearchResultsUsersLoaded)
      = Loader(this)

  article.projects(class=@hiddenIfSearchResultsHaveNoProjects)
    = ProjectListPresenter()
    span(class=@hiddenIfSearchResultsProjectsLoaded)
      = Loader(this)

  article.no-results(class=@hiddenUnlessSearchHasNoResults)
    p no results found
    img(src=cat)
  </main>

  = @Categories
);
*/
export default function(application, query) {
  const props = {
    api: application.api(),
    categories: application.categories,
    query,
  };
  const content = Reactlet(SearchPage, props);
  return LayoutPresenter(application, content);
}