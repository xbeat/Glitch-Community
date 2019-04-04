import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import SearchResults from 'Components/search/search-results';
import Layout from '../layout';
import MoreIdeas from '../more-ideas';
import NotFound from '../includes/not-found';

const SearchPage = ({ query }) => (
  <Layout searchQuery={query}>
    {!!query && <Helmet title={`Search for ${query}`} />}
    {query ? <SearchResults query={query} /> : <NotFound name="anything" />}
    <MoreIdeas />
  </Layout>
);

SearchPage.propTypes = {
  query: PropTypes.string,
};
SearchPage.defaultProps = {
  query: '',
};

export default SearchPage;
