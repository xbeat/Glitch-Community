import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

// ??const binning - 
  // group into days, but in prev charts you'll have data where you have no ticks

const chartColumns = ({buckets}) => {
  // console.log('📈', buckets)
  let x = []
  
  buckets.forEach(bucket => {
    console.log (bucket)
    
  })
  
//   analytics.buckets.map (buckets => {
//     console.log ('🍕', buckets)
    
//   })
  
  
  
  // return columns
  // map buckets into the format 
  //   columns: [
  //     ['x', time, time]
  //     ['App Views', num, num]
  //     ['Code Views', num, num]
  //   ]
  return [timestamps, remixes, ]
}

const renderC3 = (c3) => {
  var chart = c3.generate({
    size: {
        height: 200,
    },
    data: {
        x: 'x',
        xFormat: '%b-%d',
        columns: [
            ['x', 1527580801000, 1527541201000, 1527544801000, 1527548401000, 1527552001000, 1527555601000],
            ['Code Views', 30, 200, 100, 400, 150, 250],
            ['App Views', 130, 340, 200, 500, 250, 350],
        ]
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
        y: {
          tick: {
            count: 5,
            // fit: true,
            // culling: {
            //   max: 8
            // },
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
    console.log(chartColumns(analytics))
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
