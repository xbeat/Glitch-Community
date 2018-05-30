import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import * as d3Array from 'd3-array';

// ??const binning - 
  // group into days, but in prev charts you'll have data where you have no ticks

// data binning consolidates buckets
const generateHistogram = d3Array.histogram().value(function(data) {
  return data['@timestamp']
})
const consolidateHistogram = (histogram) => {
  histogram.map(bin => {
    bin.forEach (d
    //     bin.map(item => {
    //       console.log('🌹', item)

    //     })
  })
}


const createHistogram = (buckets) => {
  console.log(buckets, d3Array)
  let histogram = generateHistogram(buckets)
  
  
  console.log('🎨' ,histogram)
  return consolidateHistogram(histogram)
  
}


const chartColumns = (analytics) => {
  const buckets = analytics.buckets
  let histogram = createHistogram(buckets)
  
  
  
  let timestamps = ['x']
  let remixes = ['Remixes']
  let appViews = ['App Views']
  // let codeViews = ['Code Views']
  buckets.pop()
  buckets.forEach(bucket => {
    timestamps.push(bucket['@timestamp'])
    remixes.push(bucket.analytics.remixes)
    appViews.push(bucket.analytics.visits)
  })
  return [timestamps, remixes, appViews]
}

const renderChart = (c3, analytics) => {
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
  // console.log('🚧🛑',c3, analytics)

  renderChart(c3, analytics)

  return (null)

};

TeamAnalyticsActivity.propTypes = {
  c3: PropTypes.object.isRequired, 
  analytics: PropTypes.object.isRequired, 
  isGettingData: PropTypes.bool.isRequired,
};

export default TeamAnalyticsActivity;
