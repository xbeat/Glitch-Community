import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import SegmentedButtons from 'Components/buttons/segmented-buttons';
import Badge from 'Components/badges/badge';
import Heading from 'Components/text/heading';
import UserItem from 'Components/user/user-item';
import TeamItem from 'Components/team/team-item';
import ProjectItem from 'Components/project/project-item';
import SmallCollectionItem from 'Components/collection/small-collection-item';

import { useAPI } from '../../state/api';
import { useCurrentUser } from '../../state/current-user';
import { useAlgoliaSearch, useLegacySearch } from '../../state/search';
import useDevToggle from '../includes/dev-toggles';

import Layout from '../layout';
import { Loader } from '../includes/loader';
import MoreIdeas from '../more-ideas';
import NotFound from '../includes/not-found';

const pathForSearch = (query, filter) => `/search?q=${query}&activeFilter=${filter}`;

const FilterContainer = ({ filters, activeFilter, query }) => {
  const buttons = filters.map((filter) => ({
    name: filter.id,
    contents: (
      <>
        {filter.label}
        {filter.hits && <Badge>{filter.hits > filter.maxHits ? `${filter.maxHits}+` : filter.hits}</Badge>}
      </>
    ),
  }));
  
  const 

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

const ShowMoreButton = ({ location, label, query, filter }) => (
  <button className="show-all-btn" href={pathForSearch(query, filter)}>
    Show All {label}
  </button>
);

const MAX_UNFILTERED_RESULTS = 20;

const groupIsInFilter = (id, activeFilter) => activeFilter === 'all' || activeFilter === id;

const validFilter = (activeFilter) => ['all', 'team', 'user', 'project', 'collection'].includes(validFilter)
   
function SearchResults({ query, searchResults, activeFilter }) {
  if (!validFilter(activeFilter)) {
    activeFilter = 'all'
  }
  
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
        <FilterContainer filters={filters} activeFilter={activeFilter} query={query} />
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
            {canShowMoreResults && <ShowMoreButton label={label} query={query} filter={id} />}
          </article>
        </div>
      ))}
      {noResults && <NotFound name="any results" />}
    </main>
  );
}

// Hooks can't be _used_ conditionally, but components can be _rendered_ conditionally
const AlgoliaSearchWrapper = ({ query, activeFilter }) => {
  const searchResults = useAlgoliaSearch(query);
  return <SearchResults query={query} activeFilter={activeFilter} searchResults={searchResults} />;
};

const LegacySearchWrapper = ({ query, activeFilter }) => {
  const searchResults = useLegacySearch(query);
  return <SearchResults query={query} activeFilter={activeFilter} searchResults={searchResults} />;
};

const SearchPage = ({ query, activeFilter }) => {
  const algoliaFlag = useDevToggle('Algolia Search');
  const SearchWrapper = algoliaFlag ? AlgoliaSearchWrapper : LegacySearchWrapper;
  return (
    <Layout searchQuery={query}>
      {!!query && <Helmet title={`Search for ${query}`} />}
      {query ? <SearchWrapper query={query} activeFilter={activeFilter} /> : <NotFound name="anything" />}
      <MoreIdeas />
    </Layout>
  );
};
SearchPage.propTypes = {
  query: PropTypes.string,
  activeFilter: PropTypes.string,
};
SearchPage.defaultProps = {
  query: '',
  activeFilter: 'all',
};

export default SearchPage;
