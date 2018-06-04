import React from 'react';
import PropTypes from 'prop-types';

import Loader from './loader.jsx';

const getProjectOverview = async (id, api, currentProjectDomain) => {
  let path = `analytics/${id}/project/${currentProjectDomain}/overview`;
  try {
    return await api().get(path);
  } catch (error) {
    console.error('getProjectOverview', error);
  }
}


class TeamAnalyticsProjectDetails extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
      isGettingData: true,
    };
  }

  
  componentDidMount() {
  }
  
  componentWillUpdate() {
    this.setState({
      isGettingData: true,
    }, () => {
      console.log('get data, update deets')
    });

  }

  
  render() {
    { (this.state.isGettingData) &&
      <Loader />
    ||
      <p>yolooo data</p>
    }
  }
};

TeamAnalyticsProjectDetails.propTypes = {
  currentProjectDomain: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  api: PropTypes.func.isRequired,
};

export default TeamAnalyticsProjectDetails;
