import React from 'react';
import PropTypes from 'prop-types';

const getProjectOverview = async ({id, api}, fromDate, currentProjectDomain) => {
  let path = `analytics/${id}/team?from=${fromDate}`;
  if (currentProjectDomain !== "All Projects") {
    path = `analytics/${id}/project/${currentProjectDomain}?from=${fromDate}`;
  }
  try {
    return await api().get(path);
  } catch (error) {
    console.error('getAnalytics', error);
  }
}


const TeamAnalyticsProjectDetails = () => {
  return (
    <p>yolooo</p>
  )
};

TeamAnalyticsProjectDetails.propTypes = {
};

export default TeamAnalyticsProjectDetails;
