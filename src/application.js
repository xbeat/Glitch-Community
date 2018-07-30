/* globals API_URL APP_URL EDITOR_URL analytics application Raven */

import Observable from 'o_0';

import axios from 'axios';
import cachedCategories from './cache/categories.js';
import Model from './models/model';
import User from './models/user';
import Project from './models/project';
import Team from './models/team';

let cachedUser = undefined;
if(localStorage.cachedUser) {
  try {
    cachedUser = JSON.parse(localStorage.cachedUser);
    if (cachedUser.id <= 0) {
      throw new Error('invalid id');
    }
  } catch (error) {
    //Something bad happened in the past to get us here!
    //Act natural and pretend we're logged out
    console.warn('could not parse cachedUser', localStorage.cachedUser);
    Raven.captureMessage('failed to parse cachedUser', {extra: {cachedUser: localStorage.cachedUser}});
    cachedUser = undefined;
  }
}

if (cachedUser) {
  Raven.setUserContext({
    id: cachedUser.id,
    login: cachedUser.login,
  });
} else {
  Raven.setUserContext();
}

var self = Model({
  currentUser: cachedUser,
}).extend({

  // search - users
  searchQuery: Observable(""),

  normalizedBaseUrl() {
    return "/";
  },

  api(source) {
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
    } catch (error) {
      console.warn("Could not save to localStorage. (localStorage is disabled in private Safari windows)");
      return undefined;
    }
  },

  getLocal(key) {
    try {
      return JSON.parse(window.localStorage[key]);
    } catch (error) {
      return undefined;
    }
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
        if (response.data.id <= 0) {
          return Promise.reject(response.data);
        }
        analytics.track("Signed In",
          {provider});
        console.log("LOGGED IN", response.data);
        self.currentUser(User(response.data));
        return self.storeLocal('cachedUser', response.data);
      });
  },
  
  getCurrentUserById(id) {
    User.getUserById(application, id).then((userData) => {
      self.storeLocal('cachedUser', userData);
      const user = self.loadUser(userData);
      self.currentUser(user);
    });
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

  getProjects(projectsData) {
    const projectIds = projectsData.map(project => project.id);
    return Project.getProjectsByIds(self.api(), projectIds);
  },
 
  get categories() {
    return cachedCategories;
  },
});


self.attrModel("currentUser", User);

window.application = self;
window.API_URL = API_URL;
window.EDITOR_URL = EDITOR_URL;
window.User = User;
window.Project = Project;
window.Team = Team;

export default self;
