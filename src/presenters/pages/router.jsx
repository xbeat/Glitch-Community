import React from 'react';
import PropTypes from 'prop-types';

import qs from 'querystringify';
import {Route, Switch} from 'react-router-dom';
import Helmet from 'react-helmet';

import categories from '../../curated/categories';
import rootTeams from '../../curated/teams';

import IndexPage from './index.jsx';
import {FacebookLoginPage, GitHubLoginPage} from './login.jsx';
import QuestionsPage from './questions.jsx';
import ProjectPage from './project.jsx';
import {TeamPage, UserPage, TeamOrUserPage} from './team-or-user.jsx';
import SearchPage from './search.jsx';
import CategoryPage from './category.jsx';
import CollectionPage from './collection.jsx';
import ErrorPage from './error.jsx';

const NotFoundPage = () => (
  <React.Fragment>
    <ErrorPage title="Page Not Found" description="Maybe a typo? Or perhaps it's moved?"/>
    <Helmet>
      <title>👻 Page not found</title> {/* eslint-disable-line */}
    </Helmet>
  </React.Fragment>
);

const Router = ({api}) => (
  <Switch>
    <Route path="/" exact render={() => <IndexPage api={api}/>}/>
    <Route path="/index.html" exact strict render={() => <IndexPage api={api}/>}/>
    
    <Route path="/login/facebook" exact render={({location}) => <FacebookLoginPage api={api} code={qs.parse(location.search).code}/>}/>
    <Route path="/login/github" exact render={({location}) => <GitHubLoginPage api={api} code={qs.parse(location.search).code}/>}/>
    
    <Route path="/questions" exact render={() => <QuestionsPage api={api}/>}/>
    
    <Route path="/~:name" exact render={({match}) => <ProjectPage api={api} name={match.params.name}/>}/>
    
    <Route path="/@:name" exact render={({match}) => <TeamOrUserPage api={api} name={match.params.name}/>}/>
    
    <Route path="/@:user/:name" exact render={({match}) => <CollectionPage api={api} userLogin={match.params.user} name={match.params.name}/>}/>
    
    <Route path="/user/:id(\d+)" exact render={({match}) => <UserPage api={api} id={parseInt(match.params.id, 10)} name={`user ${match.params.id}`}/>}/>
    
    {Object.keys(rootTeams).map(name => (
      <Route key={name} path={`/${name}`} exact render={() => <TeamPage api={api} id={rootTeams[name]} name={name}/>}/>
    ))}
    
    <Route path="/search" exact render={({location}) => <SearchPage api={api} query={qs.parse(location.search).q}/>}/>
    
    {categories.map(category => (
      <Route key={category.url} path={`/${category.url}`} exact render={() => <CategoryPage api={api} collection={category}/>}/>
    ))}
    
    
    <Route render={() => <NotFoundPage/>}/>
  </Switch>
);
Router.propTypes = {
  api: PropTypes.any.isRequired,
};

export default Router;