import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';
import moment from 'moment-mini';
import _ from 'lodash';

import Loader from './loader.jsx';
import TeamAnalyticsTimePop from '../pop-overs/team-analytics-time-pop.jsx';
import TeamAnalyticsProjectPop from '../pop-overs/team-analytics-project-pop.jsx';

import TeamAnalyticsActivity from '../includes/team-analytics-activity.jsx';
import TeamAnalyticsReferrers from '../includes/team-analytics-referrers.jsx';
import TeamAnalyticsProjectDetails from '../includes/team-analytics-project-details.jsx';

const clickEvent = new CustomEvent('click', {bubbles: true, cancelable: true})
const blurEvent = new CustomEvent('blur', {bubbles: true, cancelable: true})

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
  ];
  let time = _.find(timeMap, (object) => {
    return object.time === newTime;
  });
  return time.date;
};

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
};

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

toggleGraph(summaryType) {
  let element = document.querySelector(`.c3-legend-item-${summaryType}`)
  console.log (`.c3-legend-item-${summaryType}`, element)
  if (element) {
    element.dispatchEvent(clickEvent)
    element.dispatchEvent(blurEvent)
  }
}

// const clickRemixes = (event) => {
//   console.log (event.target)
//   let element = document.querySelector('.c3-legend-item-Remixes')
//   element.dispatchEvent(clickEvent)
//   element.dispatchEvent(blurEvent)
// }

  
  updateTotals() {
    let totalAppViews = 0;
    let totalRemixes = 0;
    this.state.analytics.buckets.forEach(bucket => {
      totalAppViews += bucket.analytics.visits;
      totalRemixes += bucket.analytics.remixes;
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
        this.updateTotals();
      });
    });
  }

  updateTimeFrame(newTime) {
    this.setState({
      currentTimeFrame: newTime,
      fromDate: dateFromTime(newTime)
    }, () => {
      this.updateAnalytics();
    });
  }

  updateProjectdomain(newDomain) {
    this.setState({
      currentProjectDomain: newDomain
    }, () => {
      this.updateAnalytics();
    });
  }

  componentDidMount() {
    // eslint-disable-next-line
    import(
      /* webpackChunkName: "c3-bundle" */
      "c3"
    ).then(c3 => {
      this.setState({
        c3: c3,
        isGettingC3: false,
      });
      this.updateAnalytics();
    });
  }
  
  render() {
    if(!this.props.currentUserIsOnTeam) {
      return null;
    }

    return (
      <section className="team-analytics">
        <h2>Analytics</h2>
        <section className="controls">
          <TeamAnalyticsProjectPop
            updateProjectdomain = {this.updateProjectdomain.bind(this)}
            currentProjectDomain = {this.state.currentProjectDomain}
            projects = {this.props.projects}
          />
          <TeamAnalyticsTimePop 
            updateTimeFrame = {this.updateTimeFrame.bind(this)}
            currentTimeFrame = {this.state.currentTimeFrame}
          />
        </section>
        
        <section className="summary">
          { (this.state.isGettingData) &&
            <Loader />
          ||
            <div>
              <span className="summary-app-views" onClick={this.toggleGraph('App-Views')}>
                <span className="total app-views">
                  {this.state.totalAppViews.toLocaleString('en')}
                </span>{' '}
                <Pluralize singular="App View" plural="App Views" count={this.state.totalAppViews} showCount={false} />
              </span>
              ,{' '}
              <span className="summary-remixes" onClick={this.toggleGraph('Remixes')}>
                <span className="total remixes">
                  {this.state.totalRemixes.toLocaleString('en')}
                </span>{' '}
                <Pluralize singular="Remix" plural="Remixes" count={this.state.totalRemixes} showCount={false} />
              </span>
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

        <section className="referrers">
          <h3>Referrers</h3>
          { (this.state.isGettingData) &&
            <Loader />
          ||
            <TeamAnalyticsReferrers 
              analytics = {this.state.analytics}
              totalRemixes = {this.state.totalRemixes}
              totalAppViews = {this.state.totalAppViews}
            />
          }
        </section>

        <section className="project-details">
          <h3>Project Details</h3>
          <TeamAnalyticsProjectPop
            updateProjectdomain = {this.updateProjectdomain.bind(this)}
            currentProjectDomain = {this.state.currentProjectDomain}
            projects = {this.props.projects}
          />
          { (this.state.currentProjectDomain === "All Projects") &&
            <p>↑ Select a project for details and the latest remixes</p>
            ||
            <TeamAnalyticsProjectDetails
              currentProjectDomain = {this.state.currentProjectDomain}
              id = {this.props.id}
              api = {this.props.api}
            />
          }
        </section>

      </section>
    );
  }
}

TeamAnalytics.propTypes = {
  id: PropTypes.number.isRequired,
  api: PropTypes.func.isRequired,
  projects: PropTypes.array.isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
};

export default TeamAnalytics;
