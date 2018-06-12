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
    let element = document.querySelector(`.c3-legend-item-${summaryType}`)

    console.log ('🌹', `.c3-legend-item-${summaryType}`, element)
    
    element.dispatchEvent(clickEvent)
    element.dispatchEvent(blurEvent)
    // toggle this state summaryType
  }

//   componentDidMount() {
//   }
  
  render() {
    if(!this.props.currentUserIsOnTeam) {
      return null;
    }

    return (
      <React.Fragment>
        <span 
          className={ this.state.AppViewsActivityHidden ? null : 'disabled-summary-item' }
          onClick={() => {
            this.toggleGraph('App-Views') 
        }}>
          <span className="total app-views">
            {this.props.totalAppViews.toLocaleString('en')}
          </span>{' '}
          <Pluralize singular="App View" plural="App Views" count={this.props.totalAppViews} showCount={false} />
        </span>
        
        ,{' '}

        <span className="summary-remixes"
          onClick={() => {
            this.toggleGraph('Remixes')
         }}>
          <span className="total remixes">
            {this.props.totalRemixes.toLocaleString('en')}
          </span>{' '}
          <Pluralize singular="Remix" plural="Remixes" count={this.props.totalRemixes} showCount={false} />
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
