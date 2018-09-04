import React from 'react';
import PropTypes from 'prop-types';

import { Link as RouterLink } from 'react-router-dom';

const isSameDomain = (a, b) => (
  
);

export const Link = ({href, children, ...props}) => {
  const hrefUrl = new URL(href, window.location.href);
  <RouterLink to={href} {...props}>{children}</RouterLink>
};

Link.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Link;