/* global CDN_URL EDITOR_URL*/

export const FALLBACK_AVATAR_URL = "https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Ffallback-project-avatar.svg?1528812220123";

export const colors = {pink: "#FFA3BB", orange: "#FBA058", yellow: "#FCF3AF", green:"#30DCA6", cyan: "#67BEFF", blue: "#70A4D8", purple: "#C9BFF4" };

export const avatars = {
  computer: "https://cdn.hyperdev.com/us-east-1%3Acba180f4-ee65-4dfc-8dd5-f143280d3c10%2Fcomputer.svg",
  tetris: "https://cdn.hyperdev.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Ftetris.svg",
  robot: "https://cdn.hyperdev.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Frobot.svg",
  hardware: "https://cdn.gomix.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fhardware.svg",
  art: "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fart.svg?1499357014248",
  music: "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fmusic.svg?1502555440002",
};

export const avatarsGreyscale = {
  computer: "https://cdn.hyperdev.com/us-east-1%3Acba180f4-ee65-4dfc-8dd5-f143280d3c10%2Fcomputer.svg",
  game: "https://cdn.hyperdev.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Ftetris.svg",
  robot: "https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fbot%20copy.svg?1539799361796",
  hardware: "https://cdn.gomix.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fhardware.svg",
  art: "https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fart%20copy.svg?1539799343032",
  music: "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fmusic.svg?1502555440002",
};

export const hexToRgbA = (hex) => {
  var c;
  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
    c= hex.substring(1).split('');
    if(c.length== 3){
      c= [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c= '0x'+c.join('');
    return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.4)';
  }
  throw new Error('Bad Hex');
};


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

export function getLink(userName, url) {
  return `/@${userName}/${url}`;
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
