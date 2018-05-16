import React from 'react';
import PropTypes from 'prop-types';

import Loader from '../includes/loader.jsx';

// console.log(props)

const AnalyticsData = (id) => {
  let path = `/analytics/${id}/team`
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
    console.log('🌹', this.props.id);
  }

  // componentWillUnmount() {
  // }
  
  render() {
    return (
      <p>yoyoyo</p>
    );
  }
}


TeamAnalytics.propTypes = {
  // team: PropTypes.shape({
  //   number: PropTypes.number.isRequired,
  // }).isRequired,
  id: PropTypes.number.isRequired
};


export default TeamAnalytics;
