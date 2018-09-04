import React from 'react';
import PropTypes from 'prop-types';

import { Link as RouterLink } from 'react-router-dom';

const isNewDomain = (a, b) => (
  a.origin !== b.origin
);

// This should be provided by the server
const proxied = new Set([
  'help', 'featured', 'about', 'legal', 'faq',
  'react-starter-kit',
  'website-starter-kit',
  'forteams',
  'forplatforms',
  'you-got-this',
  'email-sales',
]);
const isProxied = (url) => (
  proxied.has(url.pathname.slice(1).split('/')[0])
);

export const Link = ({href, children, ...props}) => {
  const currentUrl = new URL(window.location.href);
  const targetUrl = new URL(href, currentUrl);
  
  if (isNewDomain(targetUrl, currentUrl) || isProxied(targetUrl)) {
    return <a href={href} {...props}>{children}</a>;
  }
  
  return <RouterLink to={href} {...props}>{children}</RouterLink>;
};

Link.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Link;