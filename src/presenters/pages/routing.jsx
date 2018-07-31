import React from 'react';
import PropTypes from 'prop-types';

import {Route, Switch} from 'react-router';

import IndexPage from './index.jsx';
import QuestionsPage from './questions.jsx';
import ProjectPage from './project.jsx';
import {TeamPage, UserPage, TeamOrUserPage} from './team-or-user.jsx';
import ErrorPage from './error.jsx';

const Routing = ({application}) => (
  <Switch>
    <Route path="/" exact render={() => <IndexPage application={application}/>}/>
    <Route path="/index.html" exact strict render={() => <IndexPage application={application}/>}/>
    <Route path="/questions" exact render={() => <QuestionsPage application={application}/>}/>
    <Route path="/~:name" exact render={({match}) => <ProjectPage application={application} name={match.params.name}/>}/>
    <Route path="/@:name" exact render={({match}) => <TeamOrUserPage application={application} name={match.params.name}/>}/>
    <Route render={() => <ErrorPage title="Page Not Found" description="Maybe a typo? Or perhaps it's moved?"/>}/>
  </Switch>
);
Routing.propTypes = {
  application: PropTypes.any.isRequired,
};

export default Routing;