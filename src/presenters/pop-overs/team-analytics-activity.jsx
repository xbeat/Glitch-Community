import React from 'react';
import PropTypes from 'prop-types';

let chartIsDrawn = false

const  TeamAnalyticsActivity = ({c3, analytics}) => {
  console.log('🚧',c3, analytics)
  if (!chartIsDrawn) {
    console.log ('rendering , once')
    var chart = c3.generate({
      size: {
          height: 240,
      },
      data: {
          x: 'x',
          columns: [
              ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
              ['code views', 30, 200, 100, 400, 150, 250],
              ['app views', 130, 340, 200, 500, 250, 350]
          ]
      },
      axis: {
          x: {
              type: 'timeseries',
              tick: {
                  format: '%Y-%m-%d'
              }
          }
      },
      legend: {
        item: {
          onclick: function (id) { console.log('legend toggled', id) }
        }
      }
    });
    chartIsDrawn = true

    }
    return (
      <div id="chart" className="c3"/>
    );

};

TeamAnalyticsActivity.propTypes = {
  c3: PropTypes.object.isRequired, 
  analytics: PropTypes.object.isRequired, 
  isGettingData: PropTypes.bool.isRequired,
};

export default TeamAnalyticsActivity;
