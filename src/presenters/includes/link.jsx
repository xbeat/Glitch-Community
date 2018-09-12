import React from 'react';
import PropTypes from 'prop-types';

import { Link as RouterLink } from 'react-router-dom';

import { getLink as getProjectLink } from '../../models/project';
import { getLink as getTeamLink } from '../../models/team';
import { getLink as getUserLink } from '../../models/user';

/* global EXTERNAL_ROUTES */
const external = new Set(EXTERNAL_ROUTES);

export const Link = ({href, children, ...props}) => {
  if (typeof href === 'string') {
    const currentUrl = new URL(window.location.href);
    const targetUrl = new URL(href, currentUrl);
    const route = targetUrl.pathname.split('/')[1];

    if (targetUrl.origin !== currentUrl.origin || external.has(route)) {
      return <a href={href} {...props}>{children}</a>;
    }
  }
  
  return <RouterLink to={href} {...props}>{children}</RouterLink>;
};
Link.propTypes = {
  href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
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