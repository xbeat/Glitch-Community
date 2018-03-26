// TODO: This file was created by bulk-decaffeinate.
// Check that you're happy with the conversion, then remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

/* globals baseUrl API_URL APP_URL EDITOR_URL analytics application*/

const Observable = require('o_0');
const _ = require('lodash');
const axios = require('axios');

const cachedCategories = require('./cache/categories.js');
const cachedTeams = require('./cache/teams.js');  
const featuredCollections = require("./curated/featured");

const Model = require("./models/model");

const User = require('./models/user');
const Project = require('./models/project');
const Category = require('./models/category');
const Team = require('./models/team');
const Question = require('./models/question');

const cachedUser = 
  localStorage.cachedUser ?
    (() => { try {
      return JSON.parse(localStorage.cachedUser);
    } catch (error) {} })() : undefined;

var self = Model({
  // featuredProjects: featuredProjects
  currentUser: cachedUser,
}).extend({

  featuredCollections,

  // overlays
  overlayProjectVisible: Observable(false),
  overlayProject: Observable(undefined),
  overlayVideoVisible: Observable(false),
  overlayNewStuffVisible: Observable(false),

  // pop overs
  signInPopVisibleOnHeader: Observable(false),
  signInPopVisibleOnRecentProjects: Observable(false),
  userOptionsPopVisible: Observable(false),
  addTeamUserPopVisible: Observable(false),
  addTeamProjectPopVisible: Observable(false),

  // search - users
  searchQuery: Observable(""),
  searchingForUsers: Observable(false),
  searchResultsUsers: Observable([]),
  searchResultsUsersLoaded: Observable(false),
  searchResultsHaveNoUsers: Observable(false),

  // search - projects
  searchingForProjects: Observable(false),
  searchResultsProjects: Observable([]),
  searchResultsProjectsLoaded: Observable(false),
  searchResultsHaveNoProjects: Observable(false),

  // search - teams
  searchingForTeams: Observable(false),
  searchResultsTeams: Observable([]),
  searchResultsTeamsLoaded: Observable(false),
  searchResultsHaveNoTeams: Observable(false),

  // questions
  questions: Observable([]),
  gettingQuestions: Observable(false),

  // pages
  pageIsTeamPage: Observable(false),
  pageIsUserPage: Observable(false),

  // category page
  category: Observable({}),
  categoryProjectsLoaded: Observable(false),

  // notifications
  notifyUserDescriptionUpdated: Observable(false), // unused, to remove
  notifyUploading() {
    return self.uploadFilesRemaining() > 0;
  },
  notifyUploadFailure: Observable(false),

  // upload status
  pendingUploads: Observable([]),
  uploadFilesRemaining() {
    return self.pendingUploads().length;
  },
  uploadProgress() { // Integer between 0..100
    const pendingUploads = self.pendingUploads();
    const numberOfPendingUploads = pendingUploads.length;

    const progress = pendingUploads.reduce((accumulator, currentValue) => accumulator + currentValue
      , 0);

    return ((progress / numberOfPendingUploads) * 100) | 0;
  },
  
  normalizedBaseUrl() {
    const urlLength = baseUrl.length;
    const lastCharacter = baseUrl.charAt(urlLength-1);
    if (baseUrl === "") {
      return "/";
    }
    if (lastCharacter === !"/") {
      return baseUrl + "/";
    } 
    return baseUrl;
    
  },

  closeAllPopOvers() {
    $(".pop-over.disposable, .overlay-background.disposable").remove();
    self.signInPopVisibleOnHeader(false);
    self.signInPopVisibleOnRecentProjects(false);
    self.userOptionsPopVisible(false);
    self.addTeamUserPopVisible(false);
    self.addTeamProjectPopVisible(false);
    self.overlayProjectVisible(false);
    self.overlayVideoVisible(false);
    return self.overlayNewStuffVisible(false);
  },

  searchProjects(query) {
    self.searchResultsProjects([]);
    return Project.getSearchResults(application, query);
  },

  searchUsers(query) {
    self.searchResultsUsers([]);
    return User.getSearchResults(application, query);
  },

  searchTeams(query) {
    self.searchResultsTeams([]);
    return Team.getSearchResults(application, query);
  },
    
    
  api(source, queries) {
    const persistentToken = self.currentUser() && self.currentUser().persistentToken();
    if (persistentToken) {
      return axios.create({  
        baseURL: API_URL,
        cancelToken: (source != null ? source.token : undefined),
        headers: {
          Authorization: persistentToken,
        },
      });
    } 
    return axios.create({
      baseURL: API_URL,
      cancelToken: (source != null ? source.token : undefined),
    });
  },

  storeLocal(key, value) {
    try {
      return window.localStorage[key] = JSON.stringify(value);
    } catch (error1) {
      return console.warn("Could not save to localStorage. (localStorage is disabled in private Safari windows)");
    }
  },

  getLocal(key) {
    try {
      return JSON.parse(window.localStorage[key]);
    } catch (error1) {}
  },

  getUserPrefs() {
    return self.getLocal('community-userPrefs') || {};
  },

  getUserPref(key) {
    return self.getUserPrefs()[key];
  },

  updateUserPrefs(key, value) {
    const prefs = self.getUserPrefs();
    prefs[key] = value;
    return self.storeLocal('community-userPrefs', prefs);
  },
    
  login(provider, code) {
    let authURL;
    console.log(provider, code);
    if (provider === "facebook") {
      // capitalize for analytics
      provider = "Facebook";
      const callbackURL = `${APP_URL}/login/facebook`;
      authURL = `/auth/facebook/${code}?callbackURL=${encodeURIComponent(callbackURL)}`;
    } else {
      provider = "GitHub";
      authURL = `/auth/github/${code}`;
    }
    return self.api().post(`${authURL}`)
      .then(function(response) {
        analytics.track("Signed In",
          {provider});
        console.log("LOGGED IN", response.data);
        self.currentUser(User(response.data));
        return self.storeLocal('cachedUser', response.data);
      });
  },

  getUserByLogin(login) {
    User.getUserByLogin(application, login).then((user) => self.saveUser(user));
  },

  getUserById(id) {
    User.getUserById(application, id).then((user) => self.saveUser(user));
  },
  
  getCurrentUserById(id) {
    User.getUserById(application, id).then((userData) => {
      const user = self.loadUser(userData);
      self.currentUser(user);
    });
  },

  getTeamById(id) {
    return Team.getTeamById(application, id);
  },

  // due to model caching, whenever user.id === currentuser.id, 
  // the objects will be set equal other.
  // this means that they must share a loader,
  // and that 'saveUser' will clobber 'getCurrentUserById'
  // but not necessarily the other way around.
  saveUser(userData) {
    
    const user = self.loadUser(userData);
    self.user(user);
  },
  
  loadUser(userData){
    userData.fetched = true;
    userData.initialDescription = userData.description;
    console.log('👀 user data is ', userData);
    self.getProjects(userData.projects);
    
    const user = User(userData).update(userData);
    const teams = user.teams().map(teamData => Team(teamData));
    user.teams(teams);
    
    return user;
  },

  saveTeam(teamData) {
    teamData.fetched = true;
    console.log('👀 team data is ', teamData);
    self.team(Team(teamData).update(teamData));
    return self.getProjects(teamData.projects);
  },

  getProjects(projectsData) {
    const projectIds = projectsData.map(project => project.id);
    return Project.getProjectsByIds(self.api(), projectIds);
  },

  getUsers(usersData) {
    const userIds = usersData.map(user => user.id);
    return User.getUsersById(self.api(), userIds);
  },

  getCategory(url) {
    const categoryData = _.find(cachedCategories, category => category.url === url);
    self.category(Category(categoryData));
    return Category.updateCategory(application, categoryData.id);
  },
 
  get categories() {
    return cachedCategories;
  },

  getQuestions() {
    let questions;
    return questions = Question.getQuestions(self).then(questions => self.questions(questions));
  },
    
  showProjectOverlayPage(domain) {
    return Project.getProjectOverlay(application, domain);
  },

  // client.coffee routing helpers
  // TODO?: move to utils.coffee
  
  removeFirstCharacter(string) {
    // ex: ~cool to cool
    const firstCharacterPosition = 1;
    const end = string.length;
    return string.substring(firstCharacterPosition, end);
  },

  isProjectUrl(url) {
    if (url.charAt(0) === "~") {
      return true;
    }
  },

  isUserProfileUrl(url) {
    if (url.charAt(0) === "@") {
      return true;
    }
  },

  isAnonUserProfileUrl(url) {
    if (url.match(/^(user\/)/g)) { // matches "user/" at beginning of url
      return true;
    }
  },
  
  anonProfileIdFromUrl(url) {
    return url.replace(/^(user\/)/g, '');
  },
  
  isSearchUrl(url, queryString) {
    const queryStringKeys = _.keys(queryString); // ['q', 'blah']
    if ((url === 'search') && (_.includes(queryStringKeys, 'q'))) {
      return true;
    }
  },

  isCategoryUrl(url) {
    if (_.find(cachedCategories, category => category.url === url)) { return true; }
  },

  isTeamUrl(url) {
    if (_.find(cachedTeams, team => team.url === url)) { return true; }
  },

  getCachedTeamByUrl(url) {
    return _.find(cachedTeams, team => team.url === url);
  },

  isQuestionsUrl(url) {
    if (url === 'questions') {
      return true;
    }
  },
});

      
self.attrModel("user", User);
self.attrModel("currentUser", User);
self.attrModel("category", Category);
self.attrModel("team", Team);
self.attrModel("question", Question);

global.application = self;
global.API_URL = API_URL;
global.EDITOR_URL = EDITOR_URL;
global.User = User;
global.Project = Project;
global.Category = Category;
global.Team = Team;
global.Question = Question;

module.exports = self;
