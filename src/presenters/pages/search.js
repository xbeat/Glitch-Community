import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { capitalize } from 'lodash';

import { useAPI } from '../../state/api';
import { useCurrentUser } from '../../state/current-user';
import { useAlgoliaSearch, useLegacySearch } from '../../state/search';
import useDevToggle from '../includes/dev-toggles';

import Layout from '../layout';
import { Loader } from '../includes/loader';
import MoreIdeas from '../more-ideas';
import NotFound from '../includes/not-found';
import ProjectsList from '../projects-list';
import TeamItem from '../team-item';
import UserItem from '../user-item';

import SegmentedButtons from '../../components/buttons/segmented-buttons';
import Badge from '../../components/badges/badge';
import Heading from '../../components/text/heading';

const generateFilterButtons = (filters) =>
  filters
    .map((filter) => {
      if (filter.hits > 0 || filter.name === 'all') {
        return {
          name: filter.name,
          contents: (
            <>
              {capitalize(filter.name)}
              {filter.hits && <Badge>{filter.hits}</Badge>}
            </>
          ),
        };
      }
      return null;
    })
    .filter(Boolean);

const FilterContainer = ({ totalHits, filters, activeFilter, setFilter, query, loaded }) => {
  if (!loaded) {
    return (
      <>
        <Loader />
        <h1>All results for {query}</h1>
      </>
    );
  }
  if (loaded && totalHits === 0) {
    return null;
  }

  return (
    <>
      <SegmentedButtons value={activeFilter} buttons={generateFilterButtons(filters)} onChange={setFilter} />
      {activeFilter === 'all' && <h1>All results for {query}</h1>}
    </>
  );
};

const TeamResults = ({ teams }) => (
  <article>
    <Heading tagName="h2">Teams</Heading>
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
    <Heading tagName="h2">Users</Heading>
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

function addProjectToCollection(api, project, collection) {
  return api.patch(`collections/${collection.id}/add/${project.id}`);
}

const ProjectResults = ({ projects }) => {
  const { currentUser } = useCurrentUser();
  const api = useAPI();
  return currentUser.login ? (
    <ProjectsList
      title="Projects"
      projects={projects}
      projectOptions={{
        addProjectToCollection: (project, collection) => addProjectToCollection(api, project, collection),
      }}
    />
  ) : (
    <ProjectsList title="Projects" projects={projects} />
  );
};

function SearchResults({ query, searchResults }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const loaded = searchResults.status === 'ready';
  const noResults = loaded && searchResults.totalHits === 0;

  const filters = [
    { name: 'all', hits: searchResults.totalHits },
    { name: 'teams', hits: searchResults.team.length },
    { name: 'users', hits: searchResults.user.length },
    { name: 'projects', hits: searchResults.project.length },
  ];

  const showTeams = ['all', 'teams'].includes(activeFilter) && !!searchResults.team.length;
  const showUsers = ['all', 'users'].includes(activeFilter) && !!searchResults.user.length;
  const showProjects = ['all', 'projects'].includes(activeFilter) && !!searchResults.project.length;

  return (
    <main className="search-results">
      <FilterContainer
        totalHits={searchResults.totalHits}
        filters={filters}
        setFilter={setActiveFilter}
        activeFilter={activeFilter}
        query={query}
        loaded={loaded}
      />
      {showTeams && <TeamResults teams={searchResults.team} />}
      {showUsers && <UserResults users={searchResults.user} />}
      {showProjects && <ProjectResults projects={searchResults.project} />}
      {noResults && <NotFound name="any results" />}
    </main>
  );
}

// Hooks can't be _used_ conditionally, but components can be _rendered_ conditionally
const AlgoliaSearchWrapper = ({ query }) => {
  const searchResults = useAlgoliaSearch(query);
  return <SearchResults query={query} searchResults={searchResults} />;
};

const LegacySearchWrapper = ({ query }) => {
  const searchResults = useLegacySearch(query);
  return <SearchResults query={query} searchResults={searchResults} />;
};

const SearchPage = ({ query }) => {
  const algoliaFlag = useDevToggle('Algolia Search');
  const SearchWrapper = algoliaFlag ? AlgoliaSearchWrapper : LegacySearchWrapper;
  return (
    <Layout searchQuery={query}>
      {!!query && <Helmet title={`Search for ${query}`} />}
      {query ? <SearchWrapper query={query} /> : <NotFound name="anything" />}
      <MoreIdeas />
    </Layout>
  );
};
SearchPage.propTypes = {
  query: PropTypes.string,
};
SearchPage.defaultProps = {
  query: '',
};

export default SearchPage;
