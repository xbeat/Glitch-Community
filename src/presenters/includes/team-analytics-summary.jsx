import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';

const clickEvent = new CustomEvent('click', {bubbles: true, cancelable: true})
const blurEvent = new CustomEvent('mouseout', {bubbles: true, cancelable: true})

class TeamAnalyticsSummary extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    // };
  }
  
  toggleGraph(summaryType) {
    let element = document.querySelector(`.c3-legend-item-${summaryType}`)
    element.dispatchEvent(clickEvent)
    element.dispatchEvent(blurEvent)
  }

  render() {
    return (
      <React.Fragment>
        <span className="summary-item" onClick={() => {this.toggleGraph('App-Views')}}>
          <span className="total app-views">
            {this.props.totalAppViews.toLocaleString('en')}
          </span>{' '}
          <Pluralize className="summary-label" singular="App View" plural="App Views" count={this.props.totalAppViews} showCount={false} />
        </span>
        
        ,{' '}

        <span className="summary-item" onClick={() => {this.toggleGraph('Remixes')}}>
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
  totalAppViews: PropTypes.number.isRequired,
  totalRemixes: PropTypes.number.isRequired,
};

export default TeamAnalyticsSummary;
