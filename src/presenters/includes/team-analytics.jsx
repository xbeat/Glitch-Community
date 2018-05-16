import React from 'react';
import PropTypes from 'prop-types';

import Loader from '../includes/loader.jsx';

// console.log(props)

const AnalyticsData = (id) => {
  
}

// Activity
// Referrers

const TeamAnalytics = ({team}) => {
  console.log('🌹',team);
  return (
    <p>yoyo</p>
  )
};

TeamAnalytics.propTypes = {
  team: PropTypes.shape({
    number: PropTypes.number.isRequired,
  }).isRequired,
};


export default TeamAnalytics;
