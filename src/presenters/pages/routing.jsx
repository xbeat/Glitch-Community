import React from 'react';
import PropTypes from 'prop-types';

import {Route, Switch} from 'react-router';

import IndexPage from './index.jsx';
import ErrorPage from './error.jsx';

const Routing = ({application}) => (
  <Switch>
    <Route path="/" exact render={() => <IndexPage application={application}/>}/>
    <Route path="/index.html" strict render={() => <IndexPage application={application}/>}/>
    <Route render={() => <ErrorPage title="Page Not Found" description="Maybe a typo? Or perhaps it's moved?"/>}/>
  </Switch>
);
Routing.propTypes = {
  application: PropTypes.any.isRequired,
};

export default Routing;