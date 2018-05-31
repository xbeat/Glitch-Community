import React from 'react';
import PropTypes from 'prop-types';

import Loader from '../includes/loader.jsx';

const createReferrers = (analytics) => {
  
}

const TeamAnalyticsReferrers = ({analytics}) => {
  console.log ('TeamAnalyticsReferrers', analytics, createReferrers(analytics))
  
  return (
    <section className="referrers">
      <h3>Referrers</h3>
      <h4>App Views</h4>
      { analytics.referrers.map(referrer => (
       <p>{referrer.domain}</p>
      ))}
    </section>
  )
};

TeamAnalyticsReferrers.propTypes = {
  analytics: PropTypes.object.isRequired,
  isGettingData: PropTypes.bool.isRequired,
};

export default TeamAnalyticsReferrers;
