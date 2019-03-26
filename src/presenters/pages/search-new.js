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


function SearchResults ({ query }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const { hits } = useSearch(query)
  const noResults = hits.length === 0
  
  const filters = [
    { name: 'all' },
    { name: 'teams' },
    { name: 'users' },
    { name: 'projects' },
  ];
  
  console.log(hits)
  
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
      {query ? <SearchResults query={query}/> : <NotFound name="anything" />}
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
