//This should probably get refactored as a context receiver

export function normalizeUser(user, currentUser) {
  return user.id === currentUser.id ? currentUser : user;
}

export function normalizeUsers(users, currentUser) {
  return users.map(user => normalizeUser(user, currentUser));
}

export function normalizeProject({users, ...project}, currentUser) {
  return {users: normalizeUsers(users, currentUser), ...project};
}

export function normalizeProjects(projects, currentUser) {
  return projects.map(project => normalizeProject(project, currentUser));
}