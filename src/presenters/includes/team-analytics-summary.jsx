import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';

const clickEvent = new CustomEvent('click', {bubbles: true, cancelable: true})
const blurEvent = new CustomEvent('blur', {bubbles: true, cancelable: true})

class TeamAnalyticsSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      AppViewsActivityHidden: false,
      RemixesActivityHidden: false,
    };
  }
  
  toggleGraph(summaryType) {
    console.log ('toggle graph clicked');
    let element = document.querySelector(`.c3-legend-item-${summaryType}`)
    console.log (`.c3-legend-item-${summaryType}`, element)
    element.dispatchEvent(clickEvent)
    element.dispatchEvent(blurEvent)
    // toggle this state summaryType
  }

  componentDidMount() {
  }
  
  render() {
    if(!this.props.currentUserIsOnTeam) {
      return null;
    }

    return (
          <TeamAnalyticsProjectPop
            updateProjectdomain = {this.updateProjectdomain.bind(this)}
            currentProjectDomain = {this.state.currentProjectDomain}
            projects = {this.props.projects}
          />
          <TeamAnalyticsTimePop 
            updateTimeFrame = {this.updateTimeFrame.bind(this)}
            currentTimeFrame = {this.state.currentTimeFrame}
          />

    );
  }
}

TeamAnalyticsSummary.propTypes = {
  currentUserIsOnTeam: PropTypes.bool.isRequired,
};

export default TeamAnalyticsSummary;
