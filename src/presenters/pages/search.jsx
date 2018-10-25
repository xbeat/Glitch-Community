import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import Layout from '../layout.jsx';

import ProjectModel from '../../models/project';
import TeamModel from '../../models/team';
import UserModel from '../../models/user';

import {CurrentUserConsumer} from '../current-user.jsx';

import ErrorHandlers from '../error-handlers.jsx';
import Categories from '../categories.jsx';
import Loader from '../includes/loader.jsx';
import NotFound from '../includes/not-found.jsx';
import ProjectsList from '../projects-list.jsx';
import TeamItem from '../team-item.jsx';
import UserItem from '../user-item.jsx';

const TeamResults = ({teams}) => (
  <article>
    <h2>Teams</h2>
    <ul className="teams-container">
      {teams ? (
        teams.map(team => (
          <li key={team.id}>
            <TeamItem team={team}/>
          </li>
        ))
      ) : <Loader/>}
    </ul>
  </article>
);

const UserResults = ({users}) => (
  <article>
    <h2>Users</h2>
    <ul className="users-container">
      {users ? (
        users.map(user => (
          <li key={user.id}>
            <UserItem user={user}/>
          </li>
        ))
      ) : <Loader/>}
    </ul>
  </article>
);

const ProjectResults = ({api, projects, currentUser}) => (
  projects ? (
    currentUser.login ? 
    <ProjectsList title="Projects" projects={projects}
      api={api}
      addProjectToCollection={addProjectToCollection}
      projectOptions={{addProjectToCollection}}/>
    : 
    <ProjectsList title="Projects" projects={projects}/>
  ) : (
    <article>
      <h2>Projects</h2>
      <Loader/>
    </article>
  )
);

async function addProjectToCollection(project, collection) {
    await this.props.api.patch(`collections/${collection.id}/add/${project.id}`);
}


const MAX_RESULTS = 20;
const showResults = (results) => !results || !!results.length;

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: null,
      users: null,
      projects: null,
    };
  }
  
  async searchTeams() {
    const {api, query} = this.props;
    const {data} = await api.get(`teams/search?q=${query}`);
    this.setState({
      teams: data.slice(0, MAX_RESULTS).map(team => TeamModel(team).update(team).asProps()),
    });
  }
  
  async searchUsers() {
    const {api, query} = this.props;
    const {data} = await api.get(`users/search?q=${query}`);
    this.setState({
      users: data.slice(0, MAX_RESULTS).map(user => UserModel(user).update(user).asProps()),
    });
  }
  
  async searchProjects() {
    const {api, query} = this.props;
    const {data} = await api.get(`projects/search?q=${query}`);
    this.setState({
      projects: data.filter(project => !project.notSafeForKids).slice(0, MAX_RESULTS).map(project => ProjectModel(project).update(project).asProps()),
    });
  }
  
  componentDidMount() {
    const {handleError} = this.props;
    this.searchTeams().catch(handleError);
    this.searchUsers().catch(handleError);
    this.searchProjects().catch(handleError);
  }
  
  render() {
    const {teams, users, projects} = this.state;
    const noResults = [teams, users, projects].every(results => !showResults(results));
    return (
      <main className="search-results">
        {showResults(teams) && <TeamResults teams={teams}/>}
        {showResults(users) && <UserResults users={users}/>}
        {showResults(projects) && <ProjectResults projects={projects} currentUser={this.props.currentUser} api={this.props.api}/>}
        {noResults && <NotFound name="any results"/>}
      </main>
    );
  }
}
SearchResults.propTypes = {
  api: PropTypes.any.isRequired,
  query: PropTypes.string.isRequired,
  currentUser: PropTypes.object.isRequired,
};

const SearchPage = ({api, query}) => (
  <Layout api={api} searchQuery={query}>
    <Helmet>
      {!!query && <title>Search for {query}</title>}
    </Helmet>
    {query ? (
      <ErrorHandlers>
        {errorFuncs => (
          <CurrentUserConsumer>
            {(currentUser) => (
              <SearchResults {...errorFuncs} api={api} query={query} currentUser={currentUser}/>
            )}
          </CurrentUserConsumer>
        )}
      </ErrorHandlers>
    ) : <NotFound name="anything"/>}
    <Categories/>
  </Layout>
);
SearchPage.propTypes = {
  api: PropTypes.any.isRequired,
  query: PropTypes.string,
};

export default SearchPage;