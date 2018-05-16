import React from 'react';
import PropTypes from 'prop-types';

import Loader from '../includes/loader.jsx';

import TeamAnalyticsTimePop from '../pop-overs/team-analytics-time-pop.jsx'

// import AnalyticsTimePop from './pop-overs/analytics-time-pop.jsx';
// import AnalyticsProjectPop from './pop-overs/analytics-project-pop.jsx';

// unused yet
const times = [
  "Last 4 Weeks",
  "Last 2 Weeks",
  "Last 24 Hours",
]

const getAnalytics = async ({id, api}) => {
  let path = `analytics/${id}/team`
  try {
    return await api().get(path)     
  } catch (error) {
    console.error('getAnalytics', error)
  }
}

// Controls
// Activity (TeamAnalyticsActivity)
// Referrers

class TeamAnalytics extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
      time: 'Last 2 Weeks',
      projects: 'All Projects',
      analytics: [],
      isLoading: true
    }
  }

  updateTime(newTime) {
    this.setState({
      time: newTime
    })
  }
  
  componentDidMount() {
    // loading c3 lib here?
    getAnalytics(this.props)
    .then(({data}) => {
      this.state({
        isLoading: false,
        analytics: data,
      });
      console.log('🚒', this.state)
    })
  }

  render() {
    return (
      <section>
        <p>i am team analytics</p>
        <TeamAnalyticsTimePop 
          updateTime = {this.updateTime.bind(this)}
          time = {this.state.time} 
        />
      </section>
    );
  }
}


TeamAnalytics.propTypes = {
  id: PropTypes.number.isRequired,
  api: PropTypes.func.isRequired,
};


export default TeamAnalytics;
