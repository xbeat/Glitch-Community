import React from 'react';
import PropTypes from 'prop-types';

const MAX_REFERRERS = 5;

const countTotals = (data, countProperty) => {
  let total = 0;
  data.forEach(referrer => {
    total += referrer[countProperty];
  });
  return total;
};

const ReferrerItem = ({referrer, countProperty, data}) => {
  const total = countTotals(data, countProperty);
  const count = referrer[countProperty];
  const progress = Math.max(Math.round(count / total * 100), 5);
  return (
    <li>
      {count.toLocaleString('en')} – {referrer.domain}
      <progress value={progress} max="100" />
    </li>
  );
};

const DirectReferrerItem = ({count, description, total}) => {
  console.log ('🍕', count, description, total)
  const progress = Math.max(Math.round(count / total * 100), 5);
  return (
    <li>
      {count} – {description}
      <progress value={progress} max="100" />
    </li>
  );
};

const filterReferrers = (referrers) => {
  let filteredReferrers = referrers.filter(referrer =>
    !referrer.self
  );
  filteredReferrers = filteredReferrers.slice(0, MAX_REFERRERS);
  return filteredReferrers;
};

const totalReferrers = (referrers, countProperty) => {
  let totalReferrers = 0;
  referrers.forEach(referrer => {
    totalReferrers += referrer[countProperty];
  })
  console.log ('totalReferrers', totalReferrers, 'referrers', referrers, 'countProperty', countProperty)
  return totalReferrers
}


const TeamAnalyticsReferrers = ({analytics, totalRemixes, totalAppViews}) => {
  const appViewReferrers = filterReferrers(analytics.referrers);
  const remixReferrers = filterReferrers(analytics.remixReferrers);
  
  const totalDirectAppViews = totalAppViews - totalReferrers(appViewReferrers, 'requests')
  const totalDirectRemixes = totalRemixes - totalReferrers(remixReferrers, 'remixes')

  return (
    <div className="referrers-content">
      <article className="referrers-column app-views">
        <h4>
          App Views
        </h4>
        <ul>
          <DirectReferrerItem
            count = {totalDirectAppViews}
            description = "direct views"
            total = {totalAppViews}
          />
          { appViewReferrers.map((referrer, key) => (
            <ReferrerItem
              key={key}
              referrer = {referrer}
              countProperty = "requests"
              data = {appViewReferrers}
            />
          ))}
        </ul>
      </article>
      
      <article className="referrers-column remixes">
        <h4>
          Remixes
        </h4>
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
    </div>
  );
};

TeamAnalyticsReferrers.propTypes = {
  analytics: PropTypes.object.isRequired,
  totalRemixes: PropTypes.number.isRequired,
  totalAppViews: PropTypes.number.isRequired,
};

export default TeamAnalyticsReferrers;
