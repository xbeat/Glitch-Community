import React from 'react';
import PropTypes from 'prop-types';

import {Route, Switch} from 'react-router';

import SearchPage from './pages/search.jsx';
import ErrorPage from './pages/error.jsx';

const App = ({application}) => (
  <Switch>
    <Route path="/search" render={() => <SearchPage
    <Route render={() => <ErrorPage title="Page Not Found" description="Maybe a typo? Or perhaps it's moved?"/>}/>
  </Switch>
);
App.propTypes = {
  application: PropTypes.any.isRequired,
};

export default App;