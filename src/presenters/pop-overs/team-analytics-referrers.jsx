import React from 'react';
import PropTypes from 'prop-types';

import Loader from '../includes/loader.jsx';

const ReferrersList = ({referrers}) => {
  return (
    <p>yolo</p>
  )
}

const TeamAnalyticsReferrers = ({analytics, isGettingData}) => {
  return (
    <section className="referrers">
      <h3>Referrers</h3>
      { (isGettingData) &&
        <Loader />
      ||
        <React.Fragment>
          <div className="referrers-column">
            <h4>App Views</h4>
            <ReferrersList
              referrers = {analytics.referrers}
            />
          </div>
          <div className="referrers-column">
            <h4>Remixes</h4>
            <ReferrersList
              referrers = {analytics.remixReferrers}
            />
          </div>
        </React.Fragment>
      }
    </section>

  )
};

TeamAnalyticsReferrers.propTypes = {
  analytics: PropTypes.object.isRequired,
  isGettingData: PropTypes.bool.isRequired,
};

export default TeamAnalyticsReferrers;
