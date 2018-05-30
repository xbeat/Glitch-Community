import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-mini';

import Loader from './loader.jsx';
import TeamAnalyticsTimePop from '../pop-overs/team-analytics-time-pop.jsx';
import TeamAnalyticsProjectPop from '../pop-overs/team-analytics-project-pop.jsx';
import TeamAnalyticsActivity from '../pop-overs/team-analytics-activity.jsx';

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
  // update to ask for individual projects:
  // analytics/${id}/project/${domain or id}
  // update to specify time frames (see above) ⏰
  let lastTwoWeeks = moment().subtract(2, 'weeks').valueOf()
  
  let path = `analytics/${id}/team?from=${lastTwoWeeks}`;
  try {
    return await api().get(path);
  } catch (error) {
    console.error('getAnalytics', error);
  }
}

// layout:
  // Controls
  // Activity (TeamAnalyticsActivity)
  // Project Overview/Details (projects remixed, etc. from weak-particle)
  // Referrers

class TeamAnalytics extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
      currentTimeFrame: 'Last 2 Weeks',
      currentProjectDomain: 'All Projects',
      analytics: {},
      c3: {},
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
      // console.log('🌎', this.state, this.state.analytics);
    });
  }
  
  componentDidMount() {
    import("c3").then(c3 => { // eslint-disable-line
      this.setState({
        c3: c3,
        isGettingC3: false,
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
        
        <section className="summary">
          { (this.state.isGettingData) &&
            <Loader />
          ||
            <p>
              <span className="total remixes">123</span>
              Remixes, 
              <span className="total app-views">456</span>
              App views
            </p>
          }
        </section>
        
        <section className="activity">
          <figure id="chart" className="c3"/>
          { (this.state.isGettingData || this.state.isGettingC3) && 
            <Loader /> 
          }
          { (!this.state.isGettingC3) &&
            <TeamAnalyticsActivity 
              c3 = {this.state.c3}
              analytics = {this.state.analytics}
              isGettingData = {this.state.isGettingData}
            />
          }
        </section>
        
        <section className="Referrers">analytics.referrers</section>
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
