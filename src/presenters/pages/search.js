import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

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
import CollectionItem from '../collection-item';

import SegmentedButtons from '../../components/buttons/segmented-buttons';
import Badge from '../../components/badges/badge';
import Heading from '../../components/text/heading';

const FilterContainer = ({ totalHits, filters, activeFilter, setFilter, query, loaded }) => {
  const buttons = filters.map((filter) => ({
    name: filter.id,
    contents: (
      <>
        {filter.label}
        {filter.hits && <Badge>{filter.hits}</Badge>}
      </>
    ),
  }));

  return (
    <>
      <SegmentedButtons value={activeFilter} buttons={buttons} onChange={setFilter} />
      {activeFilter === 'all' && <h1>All results for {query}</h1>}
    </>
  );
};

const TeamResults = ({ results }) => (
  <article>
    <Heading tagName="h2">Teams</Heading>
    <ul className="teams-container">
      {results.map((team) => (
        <li key={team.id}>
          <TeamItem team={team} />
        </li>
      ))}
    </ul>
  </article>
);

const UserResults = ({ results }) => (
  <article>
    <Heading tagName="h2">Users</Heading>
    <ul className="users-container">
      {results.map((user) => (
        <li key={user.id}>
          <UserItem user={user} />
        </li>
      ))}
    </ul>
  </article>
);

const CollectionResults = ({ results }) => (
  <article>
    <Heading tagName="h2">Collections</Heading>
    <ul className="collections-container">
      {results.map((collection) => (
        <CollectionItem key={collection.id} collection={collection} />
      ))}
    </ul>
  </article>
);

function addProjectToCollection(api, project, collection) {
  return api.patch(`collections/${collection.id}/add/${project.id}`);
}

const ProjectResults = ({ results }) => {
  const { currentUser } = useCurrentUser();
  const api = useAPI();
  return currentUser.login ? (
    <ProjectsList
      title="Projects"
      projects={results}
      projectOptions={{
        addProjectToCollection: (project, collection) => addProjectToCollection(api, project, collection),
      }}
    />
  ) : (
    <ProjectsList title="Projects" projects={results} />
  );
};

const groups = [
  { id: 'team', label: 'Teams', ResultsComponent: TeamResults },
  { id: 'user', label: 'Users', ResultsComponent: UserResults },
  { id: 'project', label: 'Projects', ResultsComponent: ProjectResults },
  { id: 'collection', label: 'Collections', ResultsComponent: CollectionResults },
];

const showGroup = (id, searchResults, activeFilter) => (activeFilter === 'all' || activeFilter === id) && searchResults[id].length > 0;

function SearchResults({ query, searchResults }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const loaded = searchResults.status === 'ready';
  const noResults = loaded && searchResults.totalHits === 0;

  const filters = [
    { id: 'all', label: 'All' },
    ...groups.map((group) => ({ ...group, hits: searchResults[group.id].length })).filter((group) => group.hits > 0),
  ];

  if (!loaded) {
    return ;
  }
  if (loaded && totalHits === 0) {
    return null;
  }

  
  
  return (
    <main className="search-results">
      {!loaded && (
        <>
          <Loader />
          <h1>All results for {query}</h1>
        </>
      )
      <FilterContainer
        totalHits={searchResults.totalHits}
        filters={filters}
        setFilter={setActiveFilter}
        activeFilter={activeFilter}
        query={query}
        loaded={loaded}
      />
      {groups.map(({ id, ResultsComponent }) =>
        showGroup(id, searchResults, activeFilter) ? <ResultsComponent results={searchResults[id]} /> : null,
      )}
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
