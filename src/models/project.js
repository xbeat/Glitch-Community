/* global CDN_URL EDITOR_URL*/

let Project;
const cache = {};

import Team from './team';
import Model from './model';

export const FALLBACK_AVATAR_URL = "https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Ffallback-project-avatar.svg?1528812220123";

export default Project = function(I, self) {
  
  if (I == null) { I = {}; }
  if (self == null) { self = Model(I); }
  if (cache[I.id]) {
    return cache[I.id];
  }

  self.defaults(I, {
    domain: undefined,
    id: undefined,
    description: undefined,
    teams: undefined,
    users: undefined,
    showAsGlitchTeam: false,
  }
  );

  self.attrObservable(...Array.from(Object.keys(I) || []));
  self.attrObservable("readme", "readmeNotFound", "projectNotFound", "fetched", "displayName", "private");
  self.attrModels('teams', Team);
  self.attrModels('users', User);

  self.extend({

    asProps() {
      const project = self;

      return {
        get teams() { return project.teams().map(team => team.asProps()); },
        get users() { return project.users().map(user => user.asProps()); },
        avatar: project.avatar(),
        description: project.description(),
        domain: project.domain(),
        id: project.id(),
        isRecentProject: !!(project.isRecentProject),
        link: getLink(self.domain()),
        name: project.name(),
        private: project.private(),
        showAsGlitchTeam: !!(project.showAsGlitchTeam && project.showAsGlitchTeam()),
      };
    },

    name() {
      return self.domain();
    },

    avatar() {
      return getAvatarUrl(self.id());
    },
  });
      
  cache[I.id] = self;
  // console.log '💎 project cache', cache

  return self;
};


Project._cache = cache;

export function getAvatarUrl(id) {
  return `${CDN_URL}/project-avatar/${id}.png`;
}

export function getLink(domain) {
  return `/~${domain}`;
}

export function getShowUrl(domain) {
  return `//${domain}.glitch.me`;
}

export function getEditorUrl(domain, path, line, character) {
  if (path && !isNaN(line) && !isNaN(character)) {
    return `${EDITOR_URL}#!/${domain}?path=${path}:${line}:${character}`;
  }
  return `${EDITOR_URL}#!/${domain}`;
}

export function getRemixUrl(domain) {
  return `${EDITOR_URL}#!/remix/${domain}`;
}

// Circular dependencies must go below module.exports
import User from './user';
