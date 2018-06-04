import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-mini';

import Loader from './loader.jsx';

const getProjectDetails = async ({id, api, currentProjectDomain}) => {
  let path = `analytics/${id}/project/${currentProjectDomain}/overview`;
  try {
    return await api().get(path);
  } catch (error) {
    console.error('getProjectDetails', error);
  }
}

const ProjectDetails = (props) => (
  <p>blah</p>
)

class TeamAnalyticsProjectDetails extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
      isGettingData: true,
      projectDetails: {},
      projectRemixes: [],
      // projectId: "",
      // projectCreatedAt: "",
      // projectDescription: "",
      // projectAvatar: "", // https://cdn.glitch.com/project-avatar/${id}.png
      // projectLastAccess: "",
      // projectLastEdited: "",
      // projectLastRemixed: "",
      // projectTotalAppVisits: 0,
      // projectTotalCodeVisits: 0,
      // projectDirectRemixes: 0,
      // projectTotalRemixes: 0,
      // projectRemixes: [],
    };
  }

  
  componentDidMount() {
    console.log ('getProjectOverview: componentDidMount')    
    getProjectDetails(this.props).then(({data}) => {
      this.setState({
        isGettingData: false,
        projectDetails: data,
        projectRemixes: data.remixes
      }, () => {
        console.log ('update project details', data)
        // <ProjectDetails 
        // />
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
          <React.Fragment>
            <ProjectDetails 
              projectDetails = {this.state.projectDetails}            
            />
            <ProjectRemixes 
              projectRemixes = {this.state.projectRemixes}            
            />            
          </React.Fragment>
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
