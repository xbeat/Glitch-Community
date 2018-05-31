import React from 'react';
import PropTypes from 'prop-types';

import Loader from '../includes/loader.jsx';

const ReferrersLists = ({analytics}) => {
  return (
    <React.Fragment>
      <article className="referrers-column">
        <h4>App Views</h4>
        <ul>
          { analytics.referrers.map(referrer => (
            <ReferrerItem
              referrer = {referrer}
              c
            />
          ))}
        </ul>
      </article> 
    </React.Fragment>
  )
}

const ReferrerItem = ({referrer}) => {
  return (
    <p>{referrer.domain}</p>
  )
}

const TeamAnalyticsReferrers = ({analytics, isGettingData}) => {
  return (
    <section className="referrers">
      <h3>Referrers</h3>
      { (isGettingData) &&
        <Loader />
      ||
        <ReferrersLists
          analytics = {analytics}
        />
      }
    </section>

  )
};

TeamAnalyticsReferrers.propTypes = {
  analytics: PropTypes.object.isRequired,
  isGettingData: PropTypes.bool.isRequired,
};

export default TeamAnalyticsReferrers;
