import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import d3 from 'd3-array'

// ??const binning - 
  // group into days, but in prev charts you'll have data where you have no ticks


const chartColumns = (analytics) => {
  if (!_.isEmpty(analytics)) {
    const buckets = analytics.buckets

    let timestamps = ['x']
    let remixes = ['Remixes']
    let appViews = ['App Views']
    // let codeViews = ['Code Views']
    // buckets = 
    buckets.pop()
    buckets.forEach(bucket => {
      timestamps.push(bucket['@timestamp'])
      remixes.push(bucket.analytics.remixes)
      appViews.push(bucket.analytics.visits)
    })
    return [timestamps, remixes, appViews]
  } else {
    return []
  }
}

const renderChart = (c3, analytics) => {
    if (!_.isEmpty(analytics)) {
      let columns = chartColumns(analytics)
    } else {
      let columns = []
    }
  var chart = c3.generate({
    size: {
        height: 200,
    },
    data: {
        x: 'x',
        xFormat: '%b-%d',
        columns: chartColumns(analytics)
    },
    axis: {
        x: {
            type: 'timeseries',
            tick: {
                format: '%b-%d',
                fit: true,
                culling: {
                  max: 12
                },
            }
        },
        // y: {
        //   tick: {
        //     count: 5,
        //     // fit: true,
        //     // culling: {
        //     //   max: 8
        //     // },
        //   }
        // },
    },
    // legend: {
    //   item: {
    //     onclick: function (id) { 
    //       console.log('legend toggled', id) 
    //     }
    //   }
    // }
  });
}

const  TeamAnalyticsActivity = ({c3, analytics}) => {
  console.log('🚧🛑',c3, analytics, d3)

  renderChart(c3, analytics)

  return (null)

};

TeamAnalyticsActivity.propTypes = {
  c3: PropTypes.object.isRequired, 
  analytics: PropTypes.object.isRequired, 
  isGettingData: PropTypes.bool.isRequired,
};

export default TeamAnalyticsActivity;
