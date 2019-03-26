import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { capitalize, sum } from 'lodash';
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

function SearchResults({ query }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const { hits } = useSearch(query);
  const noResults = hits.length === 0;
  const loaded = true;
  const grouped = groupBy(hits, ()

  const filters = [{ name: 'all', hits: hits.length }, { name: 'teams', hits: 0 }, { name: 'users', hits: 0 }, { name: 'projects', hits: 0 }];

  console.log(hits);

  return (
    <main className="search-results">
      <FilterContainer filters={filters} setFilter={setActiveFilter} activeFilter={activeFilter} query={query} loaded={loaded} />
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
