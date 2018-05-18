import React from 'react';
import PropTypes from 'prop-types';

const  TeamAnalyticsActivity = ({c3, analytics}) => {
  console.log('🚧',c3, analytics)
  return (
    <p>i am chart</p>
  );
};

TeamAnalyticsActivity.propTypes = {
  c3: PropTypes.object.isRequired, 
  analytics: PropTypes.array.isRequired, 
};

export default TeamAnalyticsActivity;
