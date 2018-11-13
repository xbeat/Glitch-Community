import React from 'react';
import PropTypes from 'prop-types';

const MAX_REFERRERS = 4;

const countTotals = (data, countProperty) => {
  let total = 0;
  data.forEach(referrer => {
    total += referrer[countProperty];
  });
  return total;
};

const ReferrerPlaceholder = ({count}) => {
  if (count === 0) {
    return 'none';
  }
  return null;
};

const ReferrerItem = ({count, total, description}) => {
  const progress = Math.max(Math.round(count / total * 100), 3);
  if (count <= 0) {
    return null;
  }
  return (
    <li>
      {count.toLocaleString('en')} – {description}
      <progress value={progress} max="100" />
    </li>
  );
};

ReferrerItem.propTypes = {
  count: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
};

const filterReferrers = (referrers) => {
  let filteredReferrers = referrers.filter(referrer =>
    !referrer.self
  );
  filteredReferrers = filteredReferrers.slice(0, MAX_REFERRERS);
  return filteredReferrers;
};

const TeamAnalyticsReferrers = ({analytics, totalRemixes, totalAppViews}) => {
  const appViewReferrers = filterReferrers(analytics.referrers);
  const remixReferrers = filterReferrers(analytics.remixReferrers);
  const totalDirectAppViews = totalAppViews - countTotals(appViewReferrers, 'requests');
  const totalDirectRemixes = totalRemixes - countTotals(remixReferrers, 'remixes');
  debugger;
  return (
    <div className="referrers-content">
      <article className="referrers-column app-views">
        <h4>
          Total App Views
        </h4>
        <ul>
          <ReferrerPlaceholder
            count = {totalAppViews}
          />
          <ReferrerItem
            count = {totalDirectAppViews}
            total = {totalAppViews}
            description = "direct views"
          />
          { appViewReferrers.map((referrer, key) => (
            <ReferrerItem
              key={key}
              count = {referrer.requests}
              total = {totalAppViews}
              description = {referrer.domain}
            />
          ))}
        </ul>
      </article>

      <article className="referrers-column remixes">
        <h4>
          Remixes
        </h4>
        <ul>
          <ReferrerPlaceholder
            count = {totalRemixes}
          />
          <ReferrerItem
            count = {totalDirectRemixes}
            total = {totalRemixes}
            description = "direct remixes"
          />
          { remixReferrers.map((referrer, key) => (
            <ReferrerItem
              key={key}
              count = {referrer.remixes}
              total = {totalRemixes}
              description = {referrer.domain}
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
