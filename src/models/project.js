/* global CDN_URL EDITOR_URL*/

export const FALLBACK_AVATAR_URL = "https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Ffallback-project-avatar.svg?1528812220123";

export default function Project({teams, users, ...project}) {
  const props = {
    teams: teams ? teams.map(team => Team(team).asProps()) : [],
    users: users ? users.map(user => User(user).asProps()) : [],
    ...project
  };
  return {
    update: data => Project(data),
    asProps: () => props,
  };
}

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
import Team from './team';
import User from './user';
