import React from 'react';
import PropTypes from 'prop-types';

const createReferrers = (analytics) => {
  
}

const TeamAnalyticsReferrers = ({analytics}) => {
  console.log ('TeamAnalyticsReferrers', analytics, createReferrers(analytics))
  
  return (
    <p>yolo</p>
  )
};

TeamAnalyticsReferrers.propTypes = {
  analytics: PropTypes.object.isRequired, 
};

export default TeamAnalyticsReferrers;
