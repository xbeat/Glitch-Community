import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import classnames from 'classnames';

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

function ProjectResult({ result }) {
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
}

const groups = [
  { id: 'team', label: 'Teams' },
  { id: 'user', label: 'Users' },
  { id: 'project', label: 'Projects' },
  { id: 'collection', label: 'Collections' },
];

const resultComponents = {
  team: ({ result }) => <TeamItem team={result} />,
  user: ({ result }) => <UserItem user={result} />,
  project: ProjectResult,
  collection: ({ result }) => <SmallCollectionItem collection={result} />,
};

const ResultComponent = ({ result }) => {
  const Component = resultComponents[result.type];
  return <Component result={result} />;
};

const ShowMoreButton = ({ label, onClick }) => (
  <button className="show-all-btn" onClick={onClick}>
    Show All {label}
  </button>
);

const MAX_UNFILTERED_RESULTS = 20;

const groupIsInFilter = (id, activeFilter) => activeFilter === 'all' || activeFilter === id;

const isSingleTopResult = (results, activeFilter) => results.length === 1 && results[0].isExactMatch && activeFilter === results[0].type;

function getResultsForGroup({ searchResults, group, activeFilter }) {
  const resultsForGroup = searchResults[group.id];
  const noResults = { results: [], canShowMoreResults: false };

  if (resultsForGroup.length === 0) return noResults;
  if (!groupIsInFilter(group.id, activeFilter)) return noResults;
  if (isSingleTopResult(resultsForGroup, activeFilter)) return noResults;

  const maxResultCount = activeFilter === group.id ? Infinity : MAX_UNFILTERED_RESULTS;
  const visibleResults = resultsForGroup.slice(0, maxResultCount);
  return {
    results: visibleResults,
    canShowMoreResults: visibleResults.length < resultsForGroup.length,
  };
}

function SearchResults({ query, searchResults }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const ready = searchResults.status === 'ready';
  const noResults = ready && searchResults.totalHits === 0;
  const showTopResults = searchResults.topResults.length > 0 && activeFilter === 'all';

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
      ...getResultsForGroup({ searchResults, group, activeFilter }),
    }))
    .filter((group) => group.results.length > 0);

  if (showTopResults) {
    renderedGroups.unshift({
      id: 'top',
      label: 'Top Results',
      results: searchResults.topResults,
      canShowMoreResults: false,
    });
  }

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
      {renderedGroups.map(({ id, label, results, canShowMoreResults }) => (
        <article key={id} className={classnames('search-results__group-container', id === 'top' && 'search-results--top-results')}>
          <Heading tagName="h2">{label}</Heading>
          <ul className="search-results__results-container">
            {results.map((result) => (
              <li key={result.id} className="search-results__result-item">
                <ResultComponent result={result} />
              </li>
            ))}
          </ul>
          {canShowMoreResults && <ShowMoreButton label={label} onClick={() => setActiveFilter(id)} />}
        </article>
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
