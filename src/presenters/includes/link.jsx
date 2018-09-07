import React from 'react';
import PropTypes from 'prop-types';

import { Link as RouterLink } from 'react-router-dom';

import { getLink as getProjectLink } from '../../models/project';
import { getLink as getTeamLink } from '../../models/team';
import { getLink as getUserLink } from '../../models/user';

// This should be provided by the server
const external = new Set([
  'edit',
  'help', 'featured', 'about', 'legal', 'faq',
  'react-starter-kit',
  'website-starter-kit',
  'forteams',
  'forplatforms',
  'you-got-this',
  'email-sales',
]);

const isExternal = (url, currentUrl) => {
  const route = url.pathname.replace(/^[/]*([^/]+).*$/, '$1');
  return url.origin !== currentUrl.origin || external.has(route);
};

export const Link = ({href, children, ...props}) => {
  const currentUrl = new URL(window.location.href);
  const targetUrl = new URL(href, currentUrl);
  
  if (isExternal(targetUrl, currentUrl)) {
    return <a href={href} {...props}>{children}</a>;
  }
  
  return <RouterLink to={href} {...props}>{children}</RouterLink>;
};
Link.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export const ProjectLink = ({project, children, ...props}) => (
  <Link href={getProjectLink(project.domain)} {...props}>{children}</Link>
);
ProjectLink.propTypes = {
  project: PropTypes.object.isRequired,
};

export const TeamLink = ({team, children, ...props}) => (
  <Link href={getTeamLink(team)} {...props}>{children}</Link>
);
TeamLink.propTypes = {
  team: PropTypes.object.isRequired,
};

export const UserLink = ({user, children, ...props}) => (
  <Link href={getUserLink(user)} {...props}>{children}</Link>
);
UserLink.propTypes = {
  user: PropTypes.object.isRequired,
};

export default Link;