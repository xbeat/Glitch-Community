/* globals EDITOR_URL Raven */
import 'details-element-polyfill';

import application from './application';
import rootTeams from './curated/teams.js';

import qs from 'querystringify';
const queryString = qs.parse(window.location.search);

import IndexPage from './presenters/pages/index.jsx';
import CategoryPage from './presenters/pages/category.jsx';
import ProjectPage from './presenters/pages/project.jsx';
import {TeamPagePresenter, UserPagePresenter, TeamOrUserPagePresenter} from './presenters/pages/team-or-user.jsx';
import QuestionsPage from './presenters/pages/questions.jsx';
import SearchPage from './presenters/pages/search.jsx';
import ErrorPage from './presenters/pages/error.jsx';

console.log("#########");
console.log("❓ query strings are", queryString);
console.log("🎏 application is", application);
console.log("👻 current user is", application.currentUser());
console.log("🌈 isSignedIn", application.currentUser().isSignedIn());
console.log("#########");



// client-side routing:

function identifyUser(application) {
  const currentUserId = application.currentUser().id();
  if (currentUserId) {
    application.getCurrentUserById(currentUserId);
  }
  const user = application.currentUser();
  const analytics = window.analytics;
  if (analytics && application.currentUser().isSignedIn()) {
    try {
      analytics.identify(user.id(), {
        name: user.name(),
        login: user.login(),
        email: user.email(),
        created_at: user.createdAt(),
      });
    } catch (error) {
      console.error(error);
      Raven.captureException(error);
    }
  }
}

function routePage(pageUrl, application) {
  // index page ✅
  if (pageUrl.match(/^index\.html$/i) || !pageUrl) {
    return {page: IndexPage(application)};
  }

  // questions page ✅
  if (pageUrl.match(/^questions$/i)) {
    return {page: QuestionsPage(application), title: "Questions"};
  }

  // ~project overlay page ✅
  if (pageUrl.charAt(0) === '~') {
    const projectDomain = pageUrl.substring(1);
    const page = ProjectPage(application, projectDomain);
    return {page, title:decodeURI(pageUrl)};
  }

  // @user page ✅
  if (pageUrl.charAt(0) === '@') {
    const name = pageUrl.substring(1);
    const page = TeamOrUserPagePresenter(application, name);
    return {page, title:decodeURI(pageUrl)};
  }

  // anon user page ✅
  if (pageUrl.match(/^(user\/)/g)) {
    const userId = parseInt(pageUrl.replace(/^(user\/)/g, ''), 10);
    const page = UserPagePresenter(application, userId, `user ${userId}`);
    return {page, title: pageUrl};
  }

  // root team page ✅
  if (rootTeams[pageUrl.toLowerCase()]) {
    const page = TeamPagePresenter(application, rootTeams[pageUrl.toLowerCase()], pageUrl);
    return {page, title: pageUrl};
  }

  // search page ✅
  if (pageUrl.match(/^search$/i) && queryString.q) {
    const query = queryString.q;
    application.searchQuery(query);
    const page = <SearchPage application={application} query={query}/>;
    return {page, title: `Search for ${query}`};
  }

  // category page ✅
  if (application.categories.some(({url}) => pageUrl === url)) {
    const category = application.categories.find(({url}) => pageUrl === url);
    const page = <CategoryPage application={application} category={category}/>;
    return {page, title: category.name};
  }
 
  // error page ✅
  return {
    page: <ErrorPage title="Page Not Found" description="Maybe a typo? Or perhaps it's moved?"/>,
    title: "👻 Page not found",
  };
}

function route(location, application) {
  const normalizedRoute = location.pathname.replace(/^\/|\/$/g, "");
  console.log(`normalizedRoute is ${normalizedRoute}`);

  //
  // Redirects
  //
  if (location.hash.startsWith("#!/")) {
    return window.location = EDITOR_URL + window.location.hash;
  }
  
  //
  // OAuth Handling
  //
  if (normalizedRoute.startsWith("login/")) {
    const provider = normalizedRoute.substring("login/".length);
    const code = queryString.code;
   
    return application.login(provider, code)
      .then(() => {
        window.location.replace("/");
      }).catch((error) => {
        const errorData = error && error.response && error.response.data;
        const deets = {provider, queryString, error: errorData};
        console.error("OAuth login error.", deets);
        Raven.captureMessage("Oauth login error", {extra: deets});

        document.title = "OAuth Login Error";
        document.body.appendChild(Reactlet(ErrorPage, {
          title: "OAuth Login Problem",
          description: "Hard to say what happened, but we couldn't log you in. Try again?",
        }));
      
      });
  }
  
  //
  // If we have a session, load it and notify our analytics:
  //
  identifyUser(application);
  
  //
  //  Page Routing
  //
  const {page, title=document.title} = routePage(normalizedRoute, application);
  document.title = title;
  document.body.appendChild(page);
}

route(window.location, application);