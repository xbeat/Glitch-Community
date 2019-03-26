import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import { capitalize, sum } from 'lodash';

import Layout from '../layout';

import { useAPI } from '../../state/api';
import { useCurrentUser } from '../../state/current-user';

import SegmentedButtons from '../../components/buttons/segmented-buttons';
import Badge from '../../components/badges/badge';
import Heading from '../../components/text/heading';

import useErrorHandlers from '../error-handlers';
import { Loader } from '../includes/loader';
import MoreIdeas from '../more-ideas';
import NotFound from '../includes/not-found';
import ProjectsList from '../projects-list';
import TeamItem from '../team-item';
import UserItem from '../user-item';


const SearchPage = ({ query }) => {
  const api = useAPI();
  const { currentUser } = useCurrentUser();
  const errorFuncs = useErrorHandlers();
  return (
    <Layout searchQuery={query}>
      {!!query && <Helmet title={`Search for ${query}`} />}
      {query ? <SearchResults {...errorFuncs} api={api} query={query} currentUser={currentUser} /> : <NotFound name="anything" />}
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
