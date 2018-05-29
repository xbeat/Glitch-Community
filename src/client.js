/* globals EDITOR_URL */
import application from './application';

import qs from 'querystringify';
const queryString = qs.parse(window.location.search);

import IndexPage from './presenters/pages/index';
import CategoryPage from './presenters/pages/category';
import UserPage from './presenters/pages/user';
import TeamPage from './presenters/pages/team';
import QuestionsPage from './presenters/pages/questions';
import SearchPage from './presenters/pages/search';
import errorPageTemplate from './templates/pages/error';

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
    analytics.identify(user.id(), {
      name: user.name(),
      login: user.login(),
      email: user.email(),
      created_at: user.createdAt(),
    });
  }
}

function routePage(normalizedRoute, application) {
    // index page ✅
  if ((normalizedRoute === "index.html") || (normalizedRoute === "")) {
    application.getQuestions();
    return {page: IndexPage(application)};
  }

  // questions page ✅
  if (application.isQuestionsUrl(normalizedRoute)) {
    return {page: QuestionsPage(application), title: "Questions"};
  }

  // ~project overlay page ✅
  if (application.isProjectUrl(normalizedRoute)) {
    const projectDomain = application.removeFirstCharacter(normalizedRoute);
    application.showProjectOverlayPage(projectDomain);
    return {page: IndexPage(application)};
  }

  // user page ✅
  if (application.isUserProfileUrl(normalizedRoute)) {
    application.pageIsUserPage(true);
    const userLogin = normalizedRoute.substring(1, normalizedRoute.length);
    const page = UserPage(application, userLogin);
    application.getUserByLogin(userLogin);
    return {page, title:decodeURI(normalizedRoute)};
  }

    // anon user page ✅
  if (application.isAnonUserProfileUrl(normalizedRoute)) {
    application.pageIsUserPage(true);
    const userId = application.anonProfileIdFromUrl(normalizedRoute);
    const page = UserPage(application, userId);
    application.getUserById(userId);
    return {page, title: normalizedRoute};
  }

    // team page ✅
  if (application.isTeamUrl(normalizedRoute)) {
    application.pageIsTeamPage(true);
    const team = application.getCachedTeamByUrl(normalizedRoute);
    const page = TeamPage(application);
    application.getTeamById(team.id);
    return {page, title: team.name};
  }

  // search page ✅
  if (application.isSearchUrl(normalizedRoute, queryString)) {
    const query = queryString.q;
    application.searchQuery(query);
    application.searchTeams(query);
    application.searchUsers(query);
    application.searchProjects(query);
    const page = SearchPage(application);
    return {page, title: `Search for ${query}`};
  }

    // category page ✅
  if (application.isCategoryUrl(normalizedRoute)) {
    application.getCategory(normalizedRoute);
    const page = CategoryPage(application);
    return {page, title: application.category().name()};
  }

  // error page ✅
  return {
    page: errorPageTemplate(application),
    title: "👻 Page not found",
  };
}

function route() {
  let normalizedRoute = window.location.pathname.replace(/^\/|\/$/g, "").toLowerCase();
  console.log(`normalizedRoute is ${normalizedRoute}`);

  //
  // Redirects
  //
  if (window.location.hash.startsWith("#!/")) {
    return window.location = EDITOR_URL + window.location.hash;
  }
  
  //
  // OAuth Handling
  //

  if (normalizedRoute.startsWith("login/")) {
    return application.login(normalizedRoute.substring("login/".length), queryString.code)
      .then(function() {
        history.replaceState(null, null, "/");
        return normalizedRoute = "";
      }).catch(function(error) {
        console.error(error);
        throw error;
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
};

route();

document.addEventListener("click", event => globalclick(event));
document.addEventListener("keyup", function(event) {
  const escapeKey = 27;
  const tabKey = 9;
  if (event.keyCode === escapeKey) {
    return application.closeAllPopOvers();
  } else if (event.keyCode === tabKey) {
    return globalclick(event);
  }
});

var globalclick = function(event) {
  if (!$(event.target).closest('.pop-over, .opens-pop-over, .overlay').length) {
    return application.closeAllPopOvers();
  }
};
