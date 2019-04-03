import React from 'react';
import PropTypes from 'prop-types';
import { getProfileStyle as getTeamProfileStyle } from '../../models/team';
import { getProfileStyle as getUserProfileStyle } from '../../models/user';

const profileStyles = {
  team: getTeamProfileStyle,
  user: getUserProfileStyle
}


const Cover = ({ type, item, size }) => 
  <div className="cover" style={profileStyles[type]({ ...item, size })} />;

Cover.propTypes = {
  type: PropTypes.oneOf(['user', 'team']).isRequired,
  size: PropTypes.oneOf(['medium']).isRequired,
}

export default Cover