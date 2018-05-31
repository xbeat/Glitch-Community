import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash'

const countTotals = (data, countProperty) => {
  let total = 0
  data.forEach(referrer => {
    total += referrer[countProperty]
  })
  return total
}

const ReferrerItem = ({referrer, countProperty, data}) => {
  // const total = 0 gotta get totals and compare them to set progress bars
  const total = countTotals(data, countProperty)
  console.log ('total', total, countProperty)
  return (
    <p>{referrer.domain}, {referrer[countProperty]}</p>
  )
}

const filterReferrers = (referrers) => {
  console.log ('referrers', referrers)
  let filteredReferrers = referrers.filter(referrer =>
    !referrer.self
  )
  console.log ('filteredReferrers', filteredReferrers)
  return filteredReferrers.slice(0.5)
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
              countProperty = "requests"
              data = {appViewReferrers}
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
              data = {remixReferrers}
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
