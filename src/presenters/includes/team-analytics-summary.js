import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';

class TeamAnalyticsSummary extends React.Component {

  render() {
    const {activeFilter, currentProjectDomain, currentTimeFrame} = this.props;
    return (
      <>
        { activeFilter === "views" && 
        <span className="summary-item">
          <span className="total app-views">{this.props.totalAppViews.toLocaleString('en')}</span>{' '}
          <Pluralize
            className="summary-label"
            singular="App View"
            plural="App Views"
            count={this.props.totalAppViews}
            showCount={false}
          />
        </span>
        }
        { activeFilter === "remixes" && 
        <span className="summary-item" >
          <span className="total remixes">{this.props.totalRemixes.toLocaleString('en')}</span>{' '}
          <Pluralize className="summary-label" singular="Remix" plural="Remixes" count={this.props.totalRemixes} showCount={false} />
        </span>
        }
      </>
    );
  }
}

TeamAnalyticsSummary.propTypes = {
  currentProjectDomain: PropTypes.string.isRequired,
  currentTimeFrame: PropTypes.string.isRequired,
  activeFilter: PropTypes.string.isRequired,
  totalAppViews: PropTypes.number.isRequired,
  totalRemixes: PropTypes.number.isRequired,
};

export default TeamAnalyticsSummary;
