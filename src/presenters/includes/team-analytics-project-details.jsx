import React from 'react';
import PropTypes from 'prop-types';

import Loader from './loader.jsx';

const getProjectOverview = async ({id, api, currentProjectDomain}) => {
  let path = `analytics/${id}/project/${currentProjectDomain}/overview`;
  try {
    return await api().get(path);
  } catch (error) {
    console.error('getProjectOverview', error);
  }
}


class TeamAnalyticsProjectDetails extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
      isGettingData: true,
    };
  }

  
  componentDidMount() {
    console.log ('getProjectOverview: componentDidMount')
    getProjectOverview(this.props).then(({data}) => {
      this.setState({
        isGettingData: false,
      }, () => {
        console.log ('hihi i have data now', data)
      });
    });

  }
  
  componentWillUpdate() {
    console.log ('getProjectOverview: componentWillUpdate')
    // this.setState({
    //   isGettingData: true,
    // }, () => {
    //   console.log('get data, update deets')
    // });

  }

  
  render() {
    return (
      <React.Fragment>
        { (this.state.isGettingData) &&
          <Loader />
        ||
          <p>yolooo data</p>
        }
      </React.Fragment>
    )
  }
};

TeamAnalyticsProjectDetails.propTypes = {
  currentProjectDomain: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  api: PropTypes.func.isRequired,
};

export default TeamAnalyticsProjectDetails;
