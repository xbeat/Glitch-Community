import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';

const TeamAnalyticsSummary = (props) => {
  {
    props.activeFilter === 'views' && (
      <span className="summary-item">
        <span className="total app-views">{props.totalAppViews.toLocaleString('en')}</span>{' '}
        <Pluralize className="summary-label" singular="App View" plural="App Views" count={props.totalAppViews} showCount={false} />
      </span>
    );
  }
  {
    props.activeFilter === 'remixes' && (
      <span className="summary-item">
        <span className="total remixes">{props.totalRemixes.toLocaleString('en')}</span>{' '}
        <Pluralize className="summary-label" singular="Remix" plural="Remixes" count={props.totalRemixes} showCount={false} />
      </span>
    );
  }
};

TeamAnalyticsSummary.propTypes = {
  activeFilter: PropTypes.string.isRequired,
  totalAppViews: PropTypes.number.isRequired,
  totalRemixes: PropTypes.number.isRequired,
};

export default TeamAnalyticsSummary;
