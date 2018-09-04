import React from 'react';
import PropTypes from 'prop-types';

import { Link as RouterLink } from 'react-router-dom';

export const Link = ({href, children, ...props}) => (
  <Link to={href} {...props}>{children}</Link>
);

Link.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Link;