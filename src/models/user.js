let User;
import axios from 'axios';
import mdFactory from 'markdown-it';
const md = mdFactory({
  breaks: true,
  linkify: true,
  typographer: true}).disable(['image']);

import Model from './model';
const cache = {};
const cacheBuster = Math.floor(Math.random() * 1000);

export const ANON_AVATAR_URL = "https://cdn.glitch.com/f6949da2-781d-4fd5-81e6-1fdd56350165%2Fanon-user-on-project-avatar.svg?1488556279399";

export default User = function(I, self) {

  if (I == null) { I = {}; }
  if (self == null) { self = Model(I); }
  if (cache[I.id]) {
    return cache[I.id];
  }
  
  self.defaults(I, {
    id: undefined,
    avatarUrl: undefined,
    avatarThumbnailUrl: undefined,
    color: undefined,
    hasCoverImage: false,
    coverColor: "#1F33D9",
    login: null,
    name: null,
    description: "",
    initialDescription: "",
    projects: undefined,
    teams: [],
    thanksCount: 0,
    fetched: false,
    showAsGlitchTeam: false,
    persistentToken: null,
    pins: [],
    deletedProjects: [],
  });

  self.attrObservable(...Array.from(Object.keys(I) || []));
  self.attrObservable("notFound");
  self.attrObservable("localCoverImage");
  self.attrModels('projects', Project);

  self.extend({

    isSignedIn() {
      return !!self.login();
    },

    isAnon() {
      return !self.login();
    },

    isAnExperiencedUser() {
      if (self.login() && (self.projects().length > 1)) {
        return true;
      }
    },

    coverUrl(size='large') {
      if (self.localCoverImage()) {
        return self.localCoverImage();
      } 

      if (self.hasCoverImage()) {
        return `https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-cover/${self.id()}/${size}?${cacheBuster}`;
      } 
      return "https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fdefault-cover-wide.svg?1503518400625";
      
    },
    
    profileStyle() {
      return {
        backgroundColor: self.coverColor(),
        backgroundImage: `url('${self.coverUrl()}')`,
      };
    },

    avatarStyle() {
      return {
        backgroundColor: self.color(),
        backgroundImage: `url('${self.userAvatarUrl('large')}')`,
      };
    },

    userAvatarUrl(size) {
      size = size || 'small';
      if (self.isAnon() || !self.avatarUrl()) {
        return self.anonAvatar();
      }
      if (size === "large") {
        return self.avatarUrl();
      }
      return self.avatarThumbnailUrl();
    },

    isCurrentUser(application) {
      return self.id() === application.currentUser().id();
    },

    isOnUserPageForCurrentUser(application) {
      return !!(application.pageIsUserPage() && self.isCurrentUser(application));
    },

    hiddenIfSignedIn() {
      if (self.isSignedIn()) { return 'hidden'; }
    },

    hiddenUnlessSignedIn() {
      if (!self.isSignedIn()) { return 'hidden'; }
    },

    //
    // hiddenIfAnon: ->
    //   'hidden' if self.isAnon()

    hiddenIfFetched() {
      if (self.fetched()) { return 'hidden'; }
    },

    hiddenUnlessFetched() {
      if (!self.fetched()) { return 'hidden'; }
    },

    tooltipName() {
      return self.login() || "anonymous user";
    },
    
    alt() {
      return `${I.login} avatar`;
    },
    
    style() {
      return {backgroundColor: I.color};
    },
    
    userLink() {
      if (self.isSignedIn()) {
        return `/@${I.login}`;
      } 
      return `/user/${I.id}`;
      
    },

    anonAvatar() {
      return ANON_AVATAR_URL;
    },

    glitchTeamAvatar() {
      return "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fglitch-team-avatar.svg";
    },

    updateUser(application, updateData) {
      const userPath = `users/${self.id()}`;
      return application.api().patch(userPath, updateData).then(({data}) => {
        console.log('updatedUser', data);
        return {
          success: true,
          data: data,
          message: null,
        };
      }).catch(error => {
        console.error(`updateUser PATCH ${userPath}`, error);
        let message = "Unable to update :-(";
        if(error && error.response && error.response.data && error.response.data.message) {
          message = error.response.data.message;
        }
        return {
          success: false,
          data: updateData,
          message,
        };
      });
    },

    updateCoverColor(application, color) {
      self.coverColor(color);
      return self.updateUser(application, 
        {coverColor: color});
    },

    truncatedDescription() {
      const MAX_CHARACTERS = 140;
      if (self.description().length > MAX_CHARACTERS) {
        return self.description().substring(0, MAX_CHARACTERS) + "…";
      } 
      return self.description();
      
    },

    descriptionMarkdown() {
      const text = self.description();
      const node = document.createElement('span');
      node.innerHTML = md.render(text);
      return node;
    },
    
    truncatedDescriptionMarkdown() {
      const text = self.truncatedDescription();
      const node = document.createElement('span');
      node.innerHTML = md.render(text);
      return node;
    },

    initialDescriptionMarkdown() {
      const text = self.initialDescription();
      const node = document.createElement('span');
      node.innerHTML = md.render(text);
      return node;
    },
    
    pushSearchResult(application) {
      application.searchResultsUsers.push(self);
      return application.searchResultsUsersLoaded(true);
    },

    userThanks() {
      const thanksCount = self.thanksCount();
      if (thanksCount === 1) {
        return "Thanked once";
      } else if (thanksCount === 2) {
        return "Thanked twice";
      } 
      return `Thanked ${thanksCount} times`;
      
    },
    
    addPin(application, projectId) {
      self.pins.push({
        projectId});
      const pinPath = `users/${self.id()}/pinned-projects/${projectId}`;
      return application.api().post(pinPath)
        .then(({data}) => console.log(data)).catch(error => console.error('addPin', error));
    },

    removePin(application, projectId) {
      const newPins = self.pins().filter(pin => pin.projectId !== projectId);
      self.pins(newPins);
      const pinPath = `users/${self.id()}/pinned-projects/${projectId}`;
      return application.api().delete(pinPath)
        .then(({data}) => console.log(data)).catch(error => console.error('removePin', error));
    },
    
    asProps() {
      return {
        get teams() { return self.teams.filter(({asProps}) => !!asProps).map(({asProps}) => asProps()); },
        get projects() { return self.projects.filter(({asProps}) => !!asProps).map(({asProps}) => asProps()); },

        alt: self.alt(),
        color: self.color(),
        coverColor: self.coverColor(),
        coverUrlSmall: self.coverUrl('small'),
        description: self.description(),
        initialDescription: self.initialDescription(),
        hasCoverImage: self.hasCoverImage(),
        id: self.id(),
        login: self.login(),
        name: self.name(),
        style: self.style(),
        profileStyle: self.profileStyle(),
        avatarStyle: self.avatarStyle(),
        thanksCount: self.thanksCount(),
        tooltipName: self.tooltipName(),
        // truncatedDescriptionHtml: md.render(self.truncatedDescription()),
        userAvatarUrl: self.userAvatarUrl(),
        userAvatarUrlLarge: self.userAvatarUrl('large'),
        userLink: self.userLink(),
        userThanks: self.userThanks(),
        
      };
    },
  });


  if (I.id) {
    cache[I.id] = self;
  }
  // console.log '☎️ user cache', cache

  return self;
};

User.getUserByLogin = function(application, login) {
  const userIdPath = `/userid/byLogin/${login}`;
  return application.api().get(userIdPath)
    .then(function(response) {
      const userId = response.data;
      if (userId === "NOT FOUND") {
        application.user().notFound(true);
        return;
      }
      return User.getUserById(application, userId);
    }).catch(error => console.error(`getUserByLogin GET ${userIdPath}`, error));
};

User.getUserById = function(application, id) {
  const userPath = `users/${id}`;
  const promise = new Promise((resolve, reject) => {
    return application.api().get(userPath)
      .then(({data}) => resolve(data)).catch(function(error) {
        console.error(`getUserById GET ${userPath}`, error);
        return reject();
      });
  });
  return promise;
};

User.getUsersById = function(api, ids) {
  const userIdsToFetch = ids.filter(function(id) {
    const user = cache[id];
    return !user || !user.fetched();
  });
  const usersPath = `users/byIds?ids=${userIdsToFetch.join(',')}`;
  return api.get(usersPath)
    .then(function({data}) {
      data.forEach(function(datum) {
        datum.fetched = true;
        return User(datum).update(datum);
      });
      return ids.map(id => User({id}));
    });
};

User.getSearchResultsJSON = function(application, query) {
  const { CancelToken } = axios;
  const source = CancelToken.source();
  const searchPath = `users/search?q=${query}`;
  return application.api(source).get(searchPath)
    .then(({data}) => data)
    .catch(error => console.error('getSearchResultsJSON', error));
};

User.getSearchResults = function(application, query) {
  const MAX_RESULTS = 20;
  application.searchResultsUsers([]);
  application.searchingForUsers(true);
  return User.getSearchResultsJSON(application, query)
    .then((data) => {
      application.searchingForUsers(false);
      data = data.slice(0 , MAX_RESULTS);
      if (data.length === 0) {
        application.searchResultsHaveNoUsers(true);
      }
      data = data.map(function(datum) {
        datum.fetched = true;
        return User(datum).update(datum);
      });
      data.forEach(function(userModel) {
        return userModel.pushSearchResult(application);
      });
      return data;
    }).catch(error => console.error('getSearchResults', error));
};


User._cache = cache;

// Circular dependencies must go below module.exports
import Project from './project';
