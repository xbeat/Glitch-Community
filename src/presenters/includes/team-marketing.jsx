import React from 'react';
import PropTypes from 'prop-types';

const TeamMarketing = ({currentUserIsOnTeam}) => {
  if (currentUserIsOnTeam) {
    return (null);
  }
  return (
    <p>yolo</p>
  )
};

TeamMarketing.propTypes = {
  currentUserIsOnTeam: PropTypes.bool.isRequired,
};

export default TeamMarketing;
