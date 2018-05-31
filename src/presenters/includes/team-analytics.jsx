import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize'
import moment from 'moment-mini';
import _ from 'lodash';

import Loader from './loader.jsx';
import TeamAnalyticsTimePop from '../pop-overs/team-analytics-time-pop.jsx';
import TeamAnalyticsProjectPop from '../pop-overs/team-analytics-project-pop.jsx';
import TeamAnalyticsActivity from '../pop-overs/team-analytics-activity.jsx';

const dateFromTime = (newTime) => {
  const timeMap = [
    {
      time: "Last 4 Weeks",
      date: moment().subtract(4, 'weeks').valueOf(),
    },
    {
      time: "Last 2 Weeks",
      date: moment().subtract(2, 'weeks').valueOf(),
    },
    {
      time: "Last 24 Hours",
      date: moment().subtract(24, 'hours').valueOf(),
    },
  ]
  let time = _.find(timeMap, (object) => {
    return object.time === newTime
  })
  return time.date
;}

// getAnalyticsProjectOverview = () (based on current project, not for all)

const getAnalytics = async ({id, api}, fromDate, currentProjectDomain) => {
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




// layout:
  // Controls

  // CONDITIONAL Project Overview/Details (projects remixed, etc. from weak-particle)

  // Activity (TeamAnalyticsActivity)
  // Referrers

class TeamAnalytics extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
      currentTimeFrame: 'Last 2 Weeks',
      fromDate: moment().subtract(2, 'weeks').valueOf(),
      currentProjectDomain: 'All Projects',
      analytics: {},
      c3: {},
      isGettingData: true,
      isGettingC3: true,
      totalRemixes: 0,
      totalAppViews: 0,
    };
  }

  updateTimeFrame(newTime) {
    this.setState({
      currentTimeFrame: newTime,
      fromDate: dateFromTime(newTime)
    }, () => {
      this.updateAnalytics()
    })
  }

  updateProjectdomain(newDomain) {
    this.setState({
      currentProjectDomain: newDomain
    });
  }

  updateTotals() {
    console.log ('update totals', this.state.analytics)
    let totalAppViews = 0
    let totalRemixes = 0
    this.state.analytics.buckets.forEach(bucket => {
      totalAppViews += bucket.analytics.visits
      totalRemixes += bucket.analytics.remixes
    });
    this.setState({
      totalAppViews: totalAppViews,
      totalRemixes: totalRemixes,
    });
  }
  
  updateAnalytics() {
    this.setState({
      isGettingData: true,
    });
    getAnalytics(this.props, this.state.fromDate, this.state.currentProjectDomain).then(({data}) => {
      this.setState({
        isGettingData: false,
        analytics: data,
      }, () => {
        this.updateTotals()
      });
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
  
  // componentDidUpdate(object prevProps, object prevState) {
  //   console.log ('componentDidUpdate')
  // }
  
//   appViewsLabel() {
//     if (this.state.totalAppViews > 1) {
//       'App Views'
//     } else {
//       'App View'
//     }
//   }
  
//   remixesLabel() {
//     if (this.state.totalRemixes > 1) {
//       'Remixes'
//     } else {
//       'Remix'
//     }
//   }
  
  render() {
    return (
      <section>
        <h2>Analytics</h2>
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
            <div>
              <span className="total app-views">
                {this.state.totalAppViews.toLocaleString('en')}
              </span>
              &nbsp;
              <Pluralize singular="App View" plural="App Views" count={this.state.totalAppViews} />
              ,&nbsp;
              <span className="total remixes">
                {this.state.totalRemixes.toLocaleString('en')}
              </span>
              &nbsp;
              <Pluralize singular="Remix" plural="Remixes" count={this.state.totalRemixes} />
            </div>
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
              currentTimeFrame = {this.state.currentTimeFrame}
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
