import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import SearchResults from 'Components/search/search-results';
import NotFound from 'Components/errors/not-found';
import Layout from '../layout';
import MoreIdeas from '../more-ideas';

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
