import React from 'react';
import PropTypes from 'prop-types';
// import moment from 'moment-mini';

import Loader from './loader.jsx';
import TeamAnalyticsTimePop from '../pop-overs/team-analytics-time-pop.jsx';
import TeamAnalyticsProjectPop from '../pop-overs/team-analytics-project-pop.jsx';

// 🗑: analytics.js, analytics.jade, analytics.styl, analytics-time-pop.jsx, analytics-project-pop.jsx, clean up team.js/jade

// unused yet
// const timeFrames = [
//   {
//     name: "Last 4 Weeks",
//     time: moment().subtract(4, 'weeks').valueOf(),
//   },
//   {
//     name: "Last 2 Weeks",
//     time: moment().subtract(2, 'weeks').valueOf(),
//   },
//   {
//     name: "Last 24 Hours",
//     time: moment().subtract(24, 'hours').valueOf(),
//   },
// ];

const getAnalytics = async ({id, api}) => {
  let path = `analytics/${id}/team`;
  try {
    return await api().get(path);
  } catch (error) {
    console.error('getAnalytics', error);
  }
}

// layout:
  // Controls
  // Activity (TeamAnalyticsActivity)
  // Remixed Projects
  // Referrers

class TeamAnalytics extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
      currentTimeFrame: 'Last 2 Weeks',
      currentProjectDomain: 'All Projects',
      analytics: [],
      isGettingData: true,
      isGettingC3: true,
    };
  }

  updateTimeFrame(newTime) {
    this.setState({
      currentTimeFrame: newTime
    });
  }

  updateProjectdomain(newDomain) {
    this.setState({
      currentProjectDomain: newDomain
    });
  }

  updateAnalytics() {
    this.setState({
      isGettingData: true,
    });
    getAnalytics(this.props).then(({data}) => {
      this.setState({
        isGettingData: false,
        analytics: data,
      });
      console.log('🌎', this.state, this.state.analytics);
    });
  }
  
  componentDidMount() {
    import("c3").then(c3 => { // eslint-disable-line
      console.log('c3 loaded', c3, this.state.isGettingS3);
      this.setState({
        isGettingC3: false
      })
      this.updateAnalytics();
    });
  }

  render() {
    return (
      <section>
        <h2>Analytics</h2>
        <p>{this.state.currentTimeFrame}</p>
        <p>{this.state.currentProjectDomain}</p>
        
        <section className="controls">
          <TeamAnalyticsTimePop 
            updateTimeFrame = {this.updateTimeFrame.bind(this)}
            currentTimeFrame = {this.state.currentTimeFrame}
          />
          <TeamAnalyticsProjectPop
            updateProjectdomain = {this.updateProjectdomain.bind(this)}
            currentProjectDomain = {this.state.currentProjectDomain}
            projects = {this.props.projects}
          />
        </section>
        
        <section className="activity">        
          { (this.state.isGettingData || this.state.isGettingC3)  && <Loader /> }
        </section>
      </section>
    );
  }
}

TeamAnalytics.propTypes = {
  id: PropTypes.number.isRequired,
  api: PropTypes.func.isRequired,
  projects: PropTypes.array.isRequired,
};

export default TeamAnalytics;
