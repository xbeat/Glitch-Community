/* globals EDITOR_URL */
import application from './application';

import qs from 'querystringify';
const queryString = qs.parse(window.location.search);

import IndexPage from './presenters/pages/index';
import CategoryPage from './presenters/pages/category';
import ProjectPage from './presenters/pages/project.jsx';
import TeamPage from './presenters/pages/team';
import UserPage from './presenters/pages/user';
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

function routePage(pageUrl, application) {
  // index page ✅
  if ((pageUrl === "index.html") || (pageUrl === "")) {
    application.getQuestions();
    return {page: IndexPage(application)};
  }

  // questions page ✅
  if (pageUrl === 'questions') {
    return {page: QuestionsPage(application), title: "Questions"};
  }

  // ~project overlay page ✅
  if (pageUrl.charAt(0) === '~') {
    const projectDomain = application.removeFirstCharacter(pageUrl);
    const page = ProjectPage(application, projectDomain);
    return {page, title:decodeURI(pageUrl)};
  }

  // user page ✅
  if (pageUrl.charAt(0) === '@') {
    application.pageIsUserPage(true);
    const userLogin = pageUrl.substring(1, pageUrl.length);
    const page = UserPage(application, userLogin);
    application.getUserByLogin(userLogin);
    return {page, title:decodeURI(pageUrl)};
  }

  // anon user page ✅
  if (pageUrl.match(/^(user\/)/g)) {
    application.pageIsUserPage(true);
    const userId = application.anonProfileIdFromUrl(pageUrl);
    const page = UserPage(application, userId);
    application.getUserById(userId);
    return {page, title: pageUrl};
  }

  // team page ✅
  if (application.isTeamUrl(pageUrl)) {
    application.pageIsTeamPage(true);
    const team = application.getCachedTeamByUrl(pageUrl);
    const page = TeamPage(application);
    application.getTeamById(team.id);
    return {page, title: team.name};
  }

  // search page ✅
  if (pageUrl === 'search' && queryString.q) {
    const query = queryString.q;
    application.searchQuery(query);
    application.searchTeams(query);
    application.searchUsers(query);
    application.searchProjects(query);
    const page = SearchPage(application);
    return {page, title: `Search for ${query}`};
  }

  // category page ✅
  if (application.isCategoryUrl(pageUrl)) {
    application.getCategory(pageUrl);
    const page = CategoryPage(application);
    return {page, title: application.category().name()};
  }
 
  // error page ✅
  return {
    page: errorPageTemplate({
      title: "Page Not Found",
      description: "Maybe a typo? Or perhaps it's moved?"
    }),
    title: "👻 Page not found",
  };
}

function route(location, application) {
  let normalizedRoute = location.pathname.replace(/^\/|\/$/g, "").toLowerCase();
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
        console.error("OAuth login error.", {provider, queryString, error: errorData});

        document.title = "OAuth Login Error";
        document.body.appendChild(errorPageTemplate({
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

document.addEventListener("click", event => globalclick(event));
document.addEventListener("keyup", function(event) {
  const escapeKey = 27;
  const tabKey = 9;
  if (event.keyCode === escapeKey) {
    return application.closeAllPopOvers();
  }
  if (event.keyCode === tabKey) {
    return globalclick(event);
  }
});

var globalclick = function(event) {
  if (!$(event.target).closest('.pop-over, .opens-pop-over, .overlay').length) {
    return application.closeAllPopOvers();
  }
};
