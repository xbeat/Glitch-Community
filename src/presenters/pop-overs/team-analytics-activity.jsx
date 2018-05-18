import React from 'react';
import PropTypes from 'prop-types';

const  TeamAnalyticsActivity = ({c3}) => {
  console.log('🚧',c3)
  return (
    <p>i am chart</p>
  );
};

TeamAnalyticsActivity.propTypes = {
  c3: PropTypes.object.isRequired, 
};

export default TeamAnalyticsActivity;
