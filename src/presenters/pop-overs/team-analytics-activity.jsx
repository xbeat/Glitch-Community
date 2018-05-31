import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import * as d3Array from 'd3-array';

const binData = d3Array.histogram().value(function(data) {
  return data['@timestamp']
})

const createHistogram = (buckets) => {
  let data = binData(buckets)
  let histogram = []
  data.forEach (bin => {
    let totalAppViews = 0
    let totalRemixes = 0
    // let codeViews = []
    bin.forEach (data => {
      totalRemixes += data.analytics.remixes
      totalAppViews += data.analytics.visits
      // referrers.push(data.analytics.referrers)
    })
    histogram.push({
      time: bin.x0,
      appViews: totalAppViews,
      remixes: totalRemixes,
    })
  })
  return histogram
}

const chartColumns = (analytics) => {
  const buckets = analytics.buckets
  let histogram = createHistogram(buckets)
  let timestamps = ['x']
  let remixes = ['Remixes']
  let appViews = ['App Views']
  // let codeViews = ['Code Views']
  histogram.shift()
  histogram.forEach(bucket => {
    timestamps.push(bucket.time)
    appViews.push(bucket.appViews)
    remixes.push(bucket.remixes)
  })
  console.log ('📈 histogram', histogram)
  return [timestamps, appViews, remixes]
}

const TeamAnalyticsActivity = ({c3, analytics, isGettingData}) => {
  let columns = []
  if (!_.isEmpty(analytics)) {
    columns = chartColumns(analytics)
  }
  var chart = c3.generate({
    size: {
        height: 200,
    },
    data: {
        x: 'x',
        xFormat: '%b-%d',
        columns: columns
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
    },
  });
  return (null)
};

TeamAnalyticsActivity.propTypes = {
  c3: PropTypes.object.isRequired, 
  analytics: PropTypes.object.isRequired, 
  isGettingData: PropTypes.bool.isRequired,
  // updateTotalRemixes: PropTypes.func.isRequired,
  // updateTotalAppViews: PropTypes.func.isRequired,
};

export default TeamAnalyticsActivity;
