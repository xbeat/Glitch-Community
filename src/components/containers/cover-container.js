import React from 'react';
import PropTypes from 'prop-types';
import { getProfileStyle as getTeamProfileStyle } from '../../models/team';
import { getProfileStyle as getUserProfileStyle } from '../../models/user';

const getProfileStyles = {
  team: getTeamProfileStyle,
  user: getUserProfileStyle,
};

const CoverContainer = ({ buttons, children, className, type, item }) => (
  <div className={`cover-container ${className}`} style={getProfileStyles[type]({ ...item, cache: item._cacheCover })}>
    {children}
    {buttons}
  </div>
);

CoverContainer.propTypes = {
  buttons: PropTypes.node,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

CoverContainer.defaultProps = {
  className: '',
  buttons: null,
};

export default CoverContainer