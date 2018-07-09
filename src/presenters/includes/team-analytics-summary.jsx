import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';

const clickEvent = new CustomEvent('click', {bubbles: true, cancelable: true});
const blurEvent = new CustomEvent('mouseout', {bubbles: true, cancelable: true});

class TeamAnalyticsSummary extends React.Component {
  constructor(props) {
    super(props);
  }
  
  toggleGraph(summaryType) {
    let element = document.querySelector(`.c3-legend-item-${summaryType}`);
    element.dispatchEvent(clickEvent);
    element.dispatchEvent(blurEvent);
  }
  
  render() {
    return (
      <React.Fragment>
        <span className="summary-item" onClick={() => {this.toggleGraph('Unique-App-Views');}} onKeyPress={() => {this.toggleGraph('App-Views');}} role="button" tabIndex={0}>
          <span className="total app-views">
            {this.props.uniqueAppViews.toLocaleString('en')}
          </span>{' '}
          <Pluralize className="summary-label" singular="Unique App View" plural="Unique App Views" count={this.props.uniqueAppViews} showCount={false} />
        </span>
        
        ,{' '}

        <span className="summary-item" onClick={() => {this.toggleGraph('Remixes');}} onKeyPress={() => {this.toggleGraph('Remixes');}} role="button" tabIndex={0}>
          <span className="total remixes">
            {this.props.totalRemixes.toLocaleString('en')}
          </span>{' '}
          <Pluralize className="summary-label" singular="Remix" plural="Remixes" count={this.props.totalRemixes} showCount={false} />
        </span>
      </React.Fragment>
    );
  }
}

TeamAnalyticsSummary.propTypes = {
  uniqueAppViews: PropTypes.number.isRequired,
  totalRemixes: PropTypes.number.isRequired,
};

export default TeamAnalyticsSummary;
