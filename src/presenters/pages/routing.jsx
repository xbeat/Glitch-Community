import React from 'react';
import PropTypes from 'prop-types';

import qs from 'querystringify';
import {Route, Switch} from 'react-router-dom';
import {Helmet} from 'react-helmet';

import rootTeams from '../../curated/teams.js';

import IndexPage from './index.jsx';
import QuestionsPage from './questions.jsx';
import ProjectPage from './project.jsx';
import {TeamPage, UserPage, TeamOrUserPage} from './team-or-user.jsx';
import SearchPage from './search.jsx';
import CategoryPage from './category.jsx';
import ErrorPage from './error.jsx';

const NotFoundPage = () => (
  <React.Fragment>
    <ErrorPage title="Page Not Found" description="Maybe a typo? Or perhaps it's moved?"/>
    <Helmet>
      <title>👻 Page not found</title> {/* eslint-disable-line */}
    </Helmet>
  </React.Fragment>
);

const Routing = ({application}) => (
  <Switch>
    <Route path="/" exact render={() => <IndexPage application={application}/>}/>
    <Route path="/index.html" exact strict render={() => <IndexPage application={application}/>}/>
    
    <Route path="/questions" exact render={() => <QuestionsPage application={application}/>}/>
    
    <Route path="/~:name" exact render={({match}) => <ProjectPage application={application} name={match.params.name}/>}/>
    
    <Route path="/@:name" exact render={({match}) => <TeamOrUserPage application={application} name={match.params.name}/>}/>
    
    <Route path="/user/:id(\d+)" exact render={({match}) => <UserPage application={application} id={parseInt(match.params.id, 10)} name={`user ${match.params.id}`}/>}/>
    
    {Object.keys(rootTeams).map(name => (
      <Route key={name} path={`/${name}`} exact render={() => <TeamPage application={application} id={rootTeams[name]} name={name}/>}/>
    ))}
    
    <Route path="/search" exact render={({location}) => <SearchPage application={application} query={qs.parse(location.search).q}/>}/>
    
    {application.categories.map(category => (
      <Route key={category.url} path={`/${category.url}`} exact render={() => <CategoryPage application={application} category={category}/>}/>
    ))}
    
    <Route render={() => <NotFoundPage/>}/>
  </Switch>
);
Routing.propTypes = {
  application: PropTypes.any.isRequired,
};

export default Routing;