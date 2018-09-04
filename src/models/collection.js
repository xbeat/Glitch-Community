/* global CDN_URL EDITOR_URL*/

export const FALLBACK_AVATAR_URL = "https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Ffallback-project-avatar.svg?1528812220123";


export const colors = {pink: "#FFA3BB", orange: "#FBA058", yellow: "#FCF3AF", green:"#30DCA6"};

export default function Collection({users, projects}) {
  const props = {
    // get teams() { return teams ? teams.map(team => Team(team).asProps()) : []; },
    get users() { return users ? users.map(user => User(user).asProps()) : []; },
    get projects() {return projects ? projects.map(project => Project(project).asProps()) : []; }
  };
  return {
    update: data => Collection(data),
    asProps: () => props,
  };
}

export function getAvatarUrl(id) {
  return `${CDN_URL}/collection-avatar/${id}.png`;
}

export function getLink(user, domain) {
  return `/${user}/~${domain}`;
}

// export function getShowUrl(domain) {
//   return `//${domain}.glitch.me`;
// }

// export function getEditorUrl(domain, path, line, character) {
//   if (path && !isNaN(line) && !isNaN(character)) {
//     return `${EDITOR_URL}#!/${domain}?path=${path}:${line}:${character}`;
//   }
//   return `${EDITOR_URL}#!/${domain}`;
// }

// export function getRemixUrl(domain) {
//   return `${EDITOR_URL}#!/remix/${domain}`;
// }

// Circular dependencies must go below module.exports
// import Team from './team';
import User from './user';
// eventually want to handle whether the collection belongs to a team or a user

import Project from './project';
