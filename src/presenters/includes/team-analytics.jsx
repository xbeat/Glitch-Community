import React from 'react';
import PropTypes from 'prop-types';

import Loader from '../includes/loader.jsx';

// import AnalyticsTimePop from './pop-overs/analytics-time-pop.jsx';
// import AnalyticsProjectPop from './pop-overs/analytics-project-pop.jsx';

// console.log(props)

const getAnalytics = async ({id, api}) => {
  // console.log ('📟', id, api)
  let path = `analytics/${id}/team`
  try {
    return await api().get(path)     
  } catch (error) {
    console.error('getAnalytics', error)
  }
  // .then(({data}) => {
  //   return data
  // })

}

// Controls
// Activity (TeamAnalyticsActivity)
// Referrers

class TeamAnalytics extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
      time: '',
      projects: '',
      analytics: [],
      isLoading: true
    }
  }

  componentDidMount() {
    // loading c3 lib here?
    getAnalytics(this.props)
    .then(({data}) => {
      this.state({
        isLoading: false,
        analytics: data,
      });
      console.log('🚒', this.state)
    })
  }

  // componentWillUnmount() {
  // }
  
  render() {
    return (
      <p>yoyoyo1</p>
    );
  }
}


TeamAnalytics.propTypes = {
  id: PropTypes.number.isRequired,
  api: PropTypes.func.isRequired,
};


export default TeamAnalytics;
