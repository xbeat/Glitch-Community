import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import SegmentedButtons from 'Components/buttons/segmented-buttons';
import Badge from 'Components/badges/badge';
import Heading from 'Components/text/heading';
import { useAPI } from '../../state/api';
import { useCurrentUser } from '../../state/current-user';
import { useAlgoliaSearch, useLegacySearch } from '../../state/search';
import useDevToggle from '../includes/dev-toggles';

import Layout from '../layout';
import { Loader } from '../includes/loader';
import MoreIdeas from '../more-ideas';
import NotFound from '../includes/not-found';
import ProjectItem from '../project-item';
import TeamItem from '../team-item';
import UserItem from '../user-item';
import SmallCollectionItem from 'Components/blocks/small-collection-item';

const FilterContainer = ({ filters, activeFilter, setFilter, query }) => {
  const buttons = filters.map((filter) => ({
    name: filter.id,
    contents: (
      <>
        {filter.label}
        {filter.hits && <Badge>{filter.hits > filter.maxHits ? `${filter.maxHits}+` : filter.hits}</Badge>}
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

function addProjectToCollection(api, project, collection) {
  return api.patch(`collections/${collection.id}/add/${project.id}`);
}

const ProjectResult = ({ result }) => {
  const { currentUser } = useCurrentUser();
  const api = useAPI();
  return currentUser.login ? (
    <ProjectItem
      project={result}
      projectOptions={{
        addProjectToCollection: (project, collection) => addProjectToCollection(api, project, collection),
      }}
    />
  ) : (
    <ProjectItem project={result} />
  );
};

const groups = [
  { id: 'team', label: 'Teams', ResultComponent: ({ result }) => <TeamItem team={result} /> },
  { id: 'user', label: 'Users', ResultComponent: ({ result }) => <UserItem user={result} /> },
  { id: 'project', label: 'Projects', ResultComponent: ProjectResult },
  { id: 'collection', label: 'Collections', ResultComponent: ({ result }) => <SmallCollectionItem collection={result} /> },
];

const ShowMoreButton = ({ label, onClick }) => <button onClick={onClick}>Show All {label}</button>;

const MAX_UNFILTERED_RESULTS = 20;

const groupIsInFilter = (id, activeFilter) => activeFilter === 'all' || activeFilter === id;

function SearchResults({ query, searchResults }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const ready = searchResults.status === 'ready';
  const noResults = ready && searchResults.totalHits === 0;

  const filters = [
    { id: 'all', label: 'All' },
    ...groups
      .map((group) => ({
        ...group,
        hits: searchResults[group.id].length,
        maxHits: activeFilter === group.id ? Infinity : MAX_UNFILTERED_RESULTS,
      }))
      .filter((group) => group.hits > 0),
  ];

  const renderedGroups = groups
    .map((group) => ({
      ...group,
      isVisible: groupIsInFilter(group.id, activeFilter) && searchResults[group.id].length > 0,
      results: activeFilter === group.id ? searchResults[group.id] : searchResults[group.id].slice(0, MAX_UNFILTERED_RESULTS),
      canShowMoreResults: activeFilter !== group.id && searchResults[group.id].length > MAX_UNFILTERED_RESULTS,
    }))
    .filter((group) => group.isVisible);

  return (
    <main className="search-results">
      {searchResults.status === 'loading' && (
        <>
          <Loader />
          <h1>All results for {query}</h1>
        </>
      )}
      {ready && searchResults.totalHits > 0 && (
        <FilterContainer filters={filters} setFilter={setActiveFilter} activeFilter={activeFilter} query={query} />
      )}
      {renderedGroups.map(({ id, label, results, canShowMoreResults, ResultComponent }) => (
        <div key={id}>
          <article className="search-results__group-container">
            <Heading tagName="h2">{label}</Heading>
            <ul className={`${id}s-container`}>
              {results.map((result) => (
                <li key={result.id}>
                  <ResultComponent result={result} />
                </li>
              ))}
            </ul>
            {canShowMoreResults && <ShowMoreButton label={label} onClick={() => setActiveFilter(id)} />}
          </article>
        </div>
      ))}
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
