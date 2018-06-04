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

const avatarUrl = (id) => {
  return `https://cdn.glitch.com/project-avatar/${id}.png`
}

const ProjectDetails = ({projectDetails, projectAvatar}) => (
  <article className="project-details">
    <img className="project-avatar" src={projectAvatar} />
    <table>
      <tr>
        <td>Description</td>
        <td>{projectDetails.description}</td>
      </tr>

      <tr>
        <td>Created</td>
        <td>{moment(projectDetails.createdAt).fromNow()}</td>
      </tr>

      <tr>
        <td>Last code view</td>
        <td>{moment(projectDetails.lastAccess).fromNow()}</td>
      </tr>

      <tr>
        <td>Last edited</td>
        <td>{moment(projectDetails.lastEditedAt).fromNow()}</td>
      </tr>
      <tr>
        <td>Last remixed</td>
        <td>{moment(projectDetails.lastRemixedAt).fromNow()}</td>
      </tr>
      <tr>
        <td>Total app views</td>
        <td>{projectDetails.description}</td>
      </tr>
      <tr>
        <td>Total code views</td>
        <td>{projectDetails.numUniqueEditorVisits}</td>
      </tr>
      <tr>
        <td>Total direct remixes</td>
        <td>{projectDetails.numDirectRemixes}</td>
      </tr>

      <tr>
        <td>Total remixes</td>
        <td>{projectDetails.numTotalRemixes}</td>
      </tr>

      { (projectDetails.baseProject.domain) &&
        <tr>
          <td>Originally remixed from</td>
          <td>{projectDetails.baseProject.domain}</td>
        </tr>
      }

    </table>
  </article>
)

const ProjectRemix = ({remix, projectAvatar}) => (
  <li>
    <img src={projectAvatar} />
    <p>{remix.domain}</p>
  </li>
)

class TeamAnalyticsProjectDetails extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
      isGettingData: true,
      projectDetails: {},
      projectRemixes: [],
    };
  }

  
  componentDidMount() {
    getProjectDetails(this.props).then(({data}) => {
      this.setState({
        isGettingData: false,
        projectDetails: data,
        projectRemixes: data.remixes.slice(0, 30)
      }, () => {
        console.log ('update project details', data)
        // <ProjectDetails 
        // />
      });
    });
  }
  
  componentWillUpdate() {
    console.log ('🚗 getProjectOverview: componentWillUpdate')
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
              projectAvatar = {avatarUrl(this.state.projectDetails.id)}
            />
            <h4>Latest Remixes</h4>
            <ul>
              { this.state.projectRemixes.map(remix => (
                <ProjectRemix
                  remix = {remix}
                  projectAvatar = {avatarUrl(remix.id)}
                />
              ))}
            </ul>
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
