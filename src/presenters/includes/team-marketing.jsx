import React from 'React';
import PropTypes from 'prop-types';

const TeamAnalyticsActivity = ({currentUserIsOnTeam}) => {
  if (currentUserIsOnTeam) {
    return (null);
  }
  return (
    <p>yolo</p>
  )
};

TeamAnalyticsActivity.propTypes = {
  currentUserIsOnTeam: PropTypes.bool.isRequired,
};

export default TeamAnalyticsActivity;
