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
  const total = countTotals(data, countProperty)
  const count = referrer[countProperty]
  const progress = Math.min(Math.round(count / total * 100), 5)
  return (
    <li>
      {referrer.domain}, {count}
      <progress value={progress} max="100" />
    </li>
  )
}

const filterReferrers = (referrers) => {
  console.log ('referrers', referrers)
  let filteredReferrers = referrers.filter(referrer =>
    !referrer.self
  )
  filteredReferrers = filteredReferrers.slice(0,5)
  console.log ('filteredReferrers', filteredReferrers)
  return filteredReferrers
}

const TeamAnalyticsReferrers = ({analytics}) => {
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
