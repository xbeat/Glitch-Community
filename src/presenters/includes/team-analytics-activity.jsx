import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import groupByTime from 'group-by-time';

// import * as d3Array from 'd3-array';

// const binData = d3Array.histogram().value(function(data) {
//   return data['@timestamp'];
// });

// var groupByTime


// adapted from https://github.com/Techwraith/group-by-time

// function getMonday(d) {
//   var day = d.getDay(),
//       diff = d.getDate() - day + (day == 0 ? -6:1) // adjust when day is sunday
//   return new Date(d.setDate(diff))
// }

// function groupByTime (arr, key, group) {
  
//   console.log ('🌹')

//   var groupings = {
//     day: function (obj) {
//       var date = new Date(obj[key])
//       date.setHours(0, 0, 0, 0)
//       return date.valueOf()
//     }
//   , week: function (obj) {
//       var date = new Date(obj[key])
//       date.setHours(0, 0, 0, 0)
//       return getMonday(date).valueOf()
//     }
//   , month: function (obj) {
//       var date = new Date(obj[key])
//       return new Date(date.getFullYear(), date.getMonth(), 1).valueOf()
//     }
//   }

//   if (!group) group == 'day'

//   return _.groupby(arr, groupings[group])

// }

// groupByTime.byDay = function (arr, key) { return groupByTime(arr, key, 'day') }
// groupByTime.byWeek = function (arr, key) { return groupByTime(arr, key, 'week') }
// groupByTime.byMonth = function (arr, key) { return groupByTime(arr, key, 'month') }



// var byday = {}

// const groupByDay(value, index, array) => {
//   d = new Date(value['date']);
//   d = Math.floor(d.getTime()/(1000*60*60*24));
//   byday[d]=byday[d]||[];
//   byday[d].push(value);
//   return byday
// }


const createHistogram = (buckets) => {
  let histogram = [];
  
  
  let bins = groupByTime(buckets, '@timestamp', 'day') // supports 'day', 'week', 'month'
  bins = Object.values(bins)
  
  
  bins.forEach (bin => {
    let uniqueAppViews = 0;
    let totalRemixes = 0;
    let timestamp = undefined;
    // let codeViews = []
    bin.forEach (data => {
      if (!timestamp) {
        timestamp = data['@timestamp']
      }
      totalRemixes += data.analytics.remixes;
      uniqueAppViews += data.analytics.uniqueIps;
      // referrers.push(data.analytics.referrers)
    });
    histogram.push({
      time: timestamp,
      appViews: uniqueAppViews,
      remixes: totalRemixes,
    });
  });
  return histogram;
};

const chartColumns = (analytics) => {
  const buckets = analytics.buckets;
  let histogram = createHistogram(buckets);
  console.log (histogram)
  let timestamps = ['x'];
  let remixes = ['Remixes'];
  let appViews = ['Unique App Views'];
  // let codeViews = ['Code Views']
  histogram.shift();
  histogram.forEach(bucket => {
    timestamps.push(bucket.time);
    appViews.push(bucket.appViews);
    remixes.push(bucket.remixes);
  });
  return [timestamps, appViews, remixes];
};

const dateFormat = (currentTimeFrame) => {
  if (currentTimeFrame === "Last 24 Hours") {
    return "%H:%M %p";
  } 
  return "%b-%d";
};

const renderChart = (c3, analytics, currentTimeFrame) => {
  let columns = [];
  if (!_.isEmpty(analytics)) {
    columns = chartColumns(analytics);
  }
  
  // eslint-disable-next-line no-unused-vars
  var chart = c3.generate({
    size: {
      height: 200,
    },
    data: {
      x: 'x',
      xFormat: dateFormat(currentTimeFrame),
      columns: columns
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          format: dateFormat(currentTimeFrame),
          // fit: true,
          // culling: {
          //   max: 12
          // },
        }
      },
    },
  });
};

class TeamAnalyticsActivity extends React.Component {
  constructor(props) {
    super(props);
  }
  
  componentDidUpdate(prevProps) {
    if (
      prevProps.isGettingData === true && 
      this.props.isGettingData === false
    ) {
      renderChart(this.props.c3, this.props.analytics, this.props.currentTimeFrame);
    }
  }
  
  render() {
    return null;
  }
}

TeamAnalyticsActivity.propTypes = {
  c3: PropTypes.object.isRequired, 
  analytics: PropTypes.object.isRequired, 
  currentTimeFrame: PropTypes.string.isRequired,
  isGettingData: PropTypes.bool.isRequired,
};

export default TeamAnalyticsActivity;
