import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash'

const ReferrerItem = ({referrer, countProperty}) => {
  console.log ('🚗', referrer, countProperty, referrer[countProperty])
  return (
    <p>{referrer.domain}, {countProperty}</p>
  )
}

const filterReferrers = (referrers) => {
  console.log ('referrers', referrers)
  let filteredReferrers = referrers.filter(referrer =>
    !referrer.self
  ).slice(0.5)
  return filteredReferrers
}

const TeamAnalyticsReferrers = ({analytics}) => {
  console.log ('analytics', analytics)
  const appViewReferrers = filterReferrers(analytics.referrers)
  const remixReferrers = filterReferrers(analytics.remixReferrers)
  return (
      <article className="referrers-column">
        <h4>App Views</h4>
        <ul>
          { appViewReferrers.map((referrer, key) => (
            <ReferrerItem
              key={key}
              referrer = {referrer}
              countProperty = "request"
            />
          ))}
        </ul>
        <h4>App Views</h4>
        <ul>
          { remixReferrers.map((referrer, key) => (
            <ReferrerItem
              key={key}
              referrer = {referrer}
              countProperty = "remixes"
            />
          ))}
        </ul>

      </article> 
  )
};

TeamAnalyticsReferrers.propTypes = {
  analytics: PropTypes.object.isRequired,
};

export default TeamAnalyticsReferrers;
