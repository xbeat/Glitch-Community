import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

const chartColumns = (analytics) => {
  console.log('📈', analytics)
  analytics.buckets.map (buckets => {
    console.log ('🍕', buckets)
  })
  // map buckets into the format 
  //   columns: [
  //     ['x', time, time]
  //     ['App Views', num, num]
  //     ['Code Views', num, num]
  //   ]
  // return columns = []
}

const renderC3 = (c3) => {
  var chart = c3.generate({
    size: {
        height: 200,
    },
    data: {
        x: 'x',
        xFormat: '%Y-%mm-%d',
        columns: [
            ['x', 1527580801000, '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
            ['Code Views', 30, 200, 100, 400, 150, 250],
            ['App Views', 130, 340, 200, 500, 250, 350]
        ]
    },
    axis: {
        x: {
            type: 'timeseries',
            tick: {
                format: '%Y-%mm-%d'
            }
        },
        y: {
          tick: {
            count: 8
          }
        },
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
  console.log('🚧🛑',c3, analytics, _.isEmpty(analytics))

  if (!_.isEmpty(analytics)) {
    chartColumns(analytics)
  }
  renderC3(c3)

  return (null)

};

TeamAnalyticsActivity.propTypes = {
  c3: PropTypes.object.isRequired, 
  analytics: PropTypes.object.isRequired, 
  isGettingData: PropTypes.bool.isRequired,
};

export default TeamAnalyticsActivity;
