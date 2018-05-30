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
    let totalRemixes = 0
    let totalAppViews = 0
    let referrers = []
    // let codeViews = []
    bin.forEach (data => {
      totalRemixes += data.analytics.remixes
      totalAppViews += data.analytics.visits
      referrers.push(data.analytics.referrers)
    })
    histogram.push({
      time: bin.x0,
      remixes: totalRemixes,
      appViews: totalAppViews,
      referrers: _.flatten(referrers)
    })
  })
  return histogram
}

const totals = (histogram) => {
  let totalRemixes = 0
  let totalAppViews = 0
  histogram.forEach (item => {
    totalRemixes += item.remixes
    totalAppViews += item.appViews    
  })
  return {
    totalRemixes: totalRemixes,
    totalAppViews: totalAppViews,
  }
}

const chartColumns = (analytics, updateTotalRemixes, updateTotalAppViews) => {
  const buckets = analytics.buckets
  let histogram = createHistogram(buckets)
  let timestamps = ['x']
  let remixes = ['Remixes']
  let appViews = ['App Views']
  // let codeViews = ['Code Views']
  console.log(histogram)
  histogram.forEach(bucket => {
    timestamps.push(bucket.time)
    remixes.push(bucket.remixes)
    appViews.push(bucket.appViews)
  })
  return {
    data: [timestamps, remixes, appViews],
    totals: totals(histogram)
  }
}

// # convert to statefull component , class etc.

const TeamAnalyticsActivity = ({c3, analytics, isGettingData, updateTotalRemixes, updateTotalAppViews}) => {
  let columns = {
    data: []
  }
  if (!_.isEmpty(analytics)) {
    columns = chartColumns(analytics)
    console.log (columns.totals)
    // console.log(updateTotalRemixes)
    // updateTotalRemixes(columns.totals.totalRemixes)
  }
  var chart = c3.generate({
    size: {
        height: 200,
    },
    data: {
        x: 'x',
        xFormat: '%b-%d',
        columns: columns.data
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
  updateTotalRemixes: PropTypes.func.isRequired,
  updateTotalAppViews: PropTypes.func.isRequired,
};

export default TeamAnalyticsActivity;
