import React from 'react';
import PropTypes from 'prop-types';

import Loader from '../includes/loader.jsx';

// console.log(props)

const AnalyticsData = ({id, api}) => {
  let path = `/analytics/${id}/team`
  console.log('🚒',path, api)
}

// Activity
// Referrers
// Controls

class TeamAnalytics extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
      time: '',
      projects: '',
      analytics: [],
      isLoading: true
    }
  }

  componentDidMount() {
    console.log('🌹', this.props);
    AnalyticsData(this.props)
  }

  // componentWillUnmount() {
  // }
  
  render() {
    return (
      <p>yoyoyo1</p>
    );
  }
}


TeamAnalytics.propTypes = {
  id: PropTypes.number.isRequired,
  api: PropTypes.func.isRequired,
};


export default TeamAnalytics;
