import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Loader from '../includes/loader.jsx';
import TeamAnalyticsTimePop from '../pop-overs/team-analytics-time-pop.jsx'
import TeamAnalyticsProjectPop from '../pop-overs/team-analytics-project-pop.jsx'

// 🗑: analytics.js, analytics.jade, analytics.styl, analytics-time-pop.jsx, analytics-project-pop.jsx

const timeFrames = [
  {
    name: "Last 4 Weeks",
    time: moment().subtract(4, 'weeks').valueOf(),
  },
  {
    name: "Last 2 Weeks",
    time: moment().subtract(2, 'weeks').valueOf(),
  },
  {
    name: "Last 24 Hours",
    time: moment().subtract(24, 'hours').valueOf(),
  },
];

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
      currentTimeFrame: 'Last 2 Weeks',
      projects: 'All Projects',
      analytics: [],
      isLoading: true,
    }
  }

  updateTimeFrame(newTime) {
    this.setState({
      currentTimeFrame: newTime
    })
  }
  
  updateAnalytics() {
    this.setState({
      isLoading: true,
    })
    getAnalytics(this.props)
    .then(({data}) => {
      this.setState({
        isLoading: false,
        analytics: data,
      });
      console.log('🚒', this.state, this.state.analytics)
    })
  }
  
  componentDidMount() {
    // loading c3 lib here?
    this.updateAnalytics()
  }

  render() {
    return (
      <section>
        <p>i am team analyticsyolo</p>
        <p>{this.state.currentTimeFrame}</p>
        <TeamAnalyticsTimePop 
          updateTimeFrame = {this.updateTimeFrame.bind(this)}
          currentTimeFrame = {this.state.currentTimeFrame}
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
