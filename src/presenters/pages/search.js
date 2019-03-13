import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import Layout from '../layout';

import { useCurrentUser } from '../current-user';

import Button from '../../components/buttons/button';

import useErrorHandlers from '../error-handlers';
import { Loader } from '../includes/loader';
import MoreIdeas from '../more-ideas';
import NotFound from '../includes/not-found';
import ProjectsList from '../projects-list';
import TeamItem from '../team-item';
import UserItem from '../user-item';

const Filters = ({
  setFilter, activeFilter, teamsCount, usersCount, projectsCount,
}) => (
  <div className="search-filters">
    <Button size="small" type={activeFilter !== 'all' ? 'tertiary' : null} onClick={() => setFilter('all')}>
      All
    </Button>
    {teamsCount > 0 && (
      <Button size="small" type={activeFilter !== 'teams' ? 'tertiary' : null} onClick={() => setFilter('teams')}>
         Teams ({teamsCount})
      </Button>
    )
    }
    {usersCount > 0 && (
      <Button size="small" type={activeFilter !== 'users' ? 'tertiary' : null} onClick={() => setFilter('users')}>
         Users ({usersCount})
      </Button>
    )
    }
    {projectsCount > 0 && (
      <Button size="small" type={activeFilter !== 'projects' ? 'tertiary' : null} onClick={() => setFilter('projects')}>
         Projects ({projectsCount})
      </Button>
    )
    }
  </div>
);

Filters.propTypes = {
  setFilter: PropTypes.func.isRequired,
  activeFilter: PropTypes.string.isRequired,
  teamsCount: PropTypes.number.isRequired,
  usersCount: PropTypes.number.isRequired,
  projectsCount: PropTypes.number.isRequired,
};

const TeamResults = ({ teams }) => (
  <article>
    <h2>Teams</h2>
    <ul className="teams-container">
      {teams ? (
        teams.map((team) => (
          <li key={team.id}>
            <TeamItem team={team} />
          </li>
        ))
      ) : (
        <Loader />
      )}
    </ul>
  </article>
);

const UserResults = ({ users }) => (
  <article>
    <h2>Users</h2>
    <ul className="users-container">
      {users ? (
        users.map((user) => (
          <li key={user.id}>
            <UserItem user={user} />
          </li>
        ))
      ) : (
        <Loader />
      )}
    </ul>
  </article>
);

const ProjectResults = ({
  addProjectToCollection,
  api,
  projects,
  currentUser,
}) => {
  if (!projects) {
    return (
      <article>
        <h2>Projects</h2>
        <Loader />
      </article>
    );
  }
  const loggedInUserWithProjects = projects && currentUser.login;
  return (loggedInUserWithProjects ? (
    <ProjectsList
      title="Projects"
      projects={projects}
      api={api}
      projectOptions={{ addProjectToCollection }}
    />
  ) : <ProjectsList title="Projects" projects={projects} api={api} />);
};

const MAX_PROJECT_RESULTS = 20;
const MAX_USER_TEAM_RESULTS = 8;

const showResults = (results) => !results || !!results.length;

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: null,
      users: null,
      projects: null,
      activeFilter: 'all',
    };
    this.addProjectToCollection = this.addProjectToCollection.bind(this);
    this.setFilter = this.setFilter.bind(this);
  }

  componentDidMount() {
    const { handleError } = this.props;
    this.searchTeams().catch(handleError);
    this.searchUsers().catch(handleError);
    this.searchProjects().catch(handleError);
  }

  setFilter(filter) {
    this.setState({ activeFilter: filter });
  }

  async searchTeams() {
    const { api, query } = this.props;
    const { data } = await api.get(`teams/search?q=${query}`);
    this.setState({
      teams: data.slice(0, MAX_USER_TEAM_RESULTS),
    });
  }

  async searchUsers() {
    const { api, query } = this.props;
    const { data } = await api.get(`users/search?q=${query}`);
    this.setState({
      users: data.slice(0, MAX_USER_TEAM_RESULTS),
    });
  }

  async searchProjects() {
    const { api, query } = this.props;
    const { data } = await api.get(`projects/search?q=${query}`);
    this.setState({
      projects: data
        .filter((project) => !project.notSafeForKids)
        .slice(0, MAX_PROJECT_RESULTS),
    });
  }

  async addProjectToCollection(project, collection) {
    await this.props.api.patch(
      `collections/${collection.id}/add/${project.id}`,
    );
  }

  render() {
    const { teams, users, projects } = this.state;
    const noResults = [teams, users, projects].every(
      (results) => !showResults(results),
    );
    const showTeams = (this.state.activeFilter === 'all' || this.state.activeFilter === 'teams') && showResults(teams);
    const showUsers = (this.state.activeFilter === 'all' || this.state.activeFilter === 'users') && showResults(users);
    const showProjects = (this.state.activeFilter === 'all' || this.state.activeFilter === 'projects') && showResults(projects);
    const totalResults = (teams && teams.length) + (users && users.length) + (projects && projects.length);
    return (
      <main className="search-results">
        <Filters
          setFilter={this.setFilter}
          activeFilter={this.state.activeFilter}
          teamsCount={teams ? teams.length : 0}
          usersCount={users ? users.length : 0}
          projectsCount={projects ? projects.length : 0}
        />
        { this.state.activeFilter === 'all' && 
          <h1>
            {totalResults} results for {this.props.query}
          </h1>
        }
        { showTeams && <TeamResults teams={teams} />}
        { showUsers && <UserResults users={users} />}
        { showProjects && (
          <ProjectResults
            projects={projects}
            currentUser={this.props.currentUser}
            api={this.props.api}
            addProjectToCollection={this.addProjectToCollection}
          />
        )}
        {noResults && <NotFound name="any results" />}
      </main>
    );
  }
}
SearchResults.propTypes = {
  api: PropTypes.any,
  query: PropTypes.string.isRequired,
  currentUser: PropTypes.object.isRequired,
};

SearchResults.defaultProps = {
  api: null,
};

const SearchPage = ({ api, query }) => {
  const { currentUser } = useCurrentUser();
  const errorFuncs = useErrorHandlers();
  return (
    <Layout api={api} searchQuery={query}>
      <Helmet>
        {!!query && (
          <title>Search for {query}</title>
        )}
      </Helmet>
      {query ? (
        <SearchResults
          {...errorFuncs}
          api={api}
          query={query}
          currentUser={currentUser}
        />
      ) : (
        <NotFound name="anything" />
      )}
      <MoreIdeas api={api} />
    </Layout>
  );
};
SearchPage.propTypes = {
  api: PropTypes.any.isRequired,
  query: PropTypes.string,
};
SearchPage.defaultProps = {
  query: '',
};

export default SearchPage;
