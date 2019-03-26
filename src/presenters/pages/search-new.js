import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { capitalize, sum, groupBy } from 'lodash';
import algoliasearch from 'algoliasearch';

import { useAPI } from '../../state/api';
import { useCurrentUser } from '../../state/current-user';
import { useSearch } from '../../state/search';
import useErrorHandlers from '../error-handlers';

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

const FilterContainer = ({ filters, activeFilter, setFilter, query, loaded }) => {
  const totalHits = sum(filters, (filter) => filter.hits);

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
      <SegmentedButtons buttons={generateFilterButtons(filters)} onClick={setFilter} />
      {activeFilter === 'all' && <h1>All results for {query}</h1>}
    </>
  );
};

const TeamResults = ({ teams }) => (
  <article>
    <Heading tagName="h2">Teams</Heading>
    <ul className="teams-container">{teams ? teams.map((team) => <li key={team.id}><TeamItem team={team} /></li>) : <Loader />}</ul>
  </article>
);

const UserResults = ({ users }) => (
  <article>
    <Heading tagName="h2">Users</Heading>
    <ul className="users-container">{users ? users.map((user) => <li key={user.id}><UserItem user={user} /></li>) : <Loader />}</ul>
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

const emptyResults = { team: [], user: [], project: [] };

function SearchResults({ query }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const { hits } = useSearch(query);
  const noResults = hits.length === 0;
  const loaded = true;
  const grouped = { ...emptyResults, ...groupBy(hits, (hit) => hit.type) };

  const filters = [
    { name: 'all', hits: hits.length },
    { name: 'teams', hits: grouped.team.length },
    { name: 'users', hits: grouped.user.length },
    { name: 'projects', hits: grouped.project.length },
  ];

  const showTeams = ['all', 'teams'].includes(activeFilter) && !!grouped.team.length;
  const showUsers = ['all', 'users'].includes(activeFilter) && !!grouped.user.length;
  const showProjects = ['all', 'projects'].includes(activeFilter) && !!grouped.project.length;

  return (
    <main className="search-results">
      <FilterContainer filters={filters} setFilter={setActiveFilter} activeFilter={activeFilter} query={query} loaded={loaded} />
      {showTeams && <TeamResults teams={grouped.team} />}
      {showUsers && <UserResults users={grouped.user} />}
      {showProjects && <ProjectResults projects={grouped.project} />}
      {noResults && <NotFound name="any results" />}
    </main>
  );
}

const SearchPage = ({ query }) => {
  return (
    <Layout searchQuery={query}>
      {!!query && <Helmet title={`Search for ${query}`} />}
      {query ? <SearchResults query={query} /> : <NotFound name="anything" />}
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
