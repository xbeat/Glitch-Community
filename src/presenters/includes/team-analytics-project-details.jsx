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

const ProjectDetails = ({projectDetails}) => {
  let projectAvatar = avatarUrl(projectDetails.id)
  let projectUrl = `/~${projectDetails.domain}`

  return (
    <article className="project-details">
      <a href={projectUrl}>
        <img className="project-avatar" src={projectAvatar} />
      </a>
      <p>{projectDetails.description}</p>
      <table>
        <tr>
          <td>
            <span className="emoji sparkles" />
            Created
          </td>
          <td>{moment(projectDetails.createdAt).fromNow()}</td>
        </tr>
        <tr>
          <td>
            <span className="emoji clock" />
            Last code view
          </td>
          <td>{moment(projectDetails.lastAccess).fromNow()}</td>
        </tr>
        <tr>
          <td>
            <span className="emoji clock" />
            Last edited
          </td>
          <td>{moment(projectDetails.lastEditedAt).fromNow()}</td>
        </tr>
        <tr>
          <td>
            <span className="emoji clock" />
            Last remixed
          </td>
          <td>{moment(projectDetails.lastRemixedAt).fromNow()}</td>
        </tr>
        <tr>
          <td>
            <span className="emoji eyes" />
            Total app views
          </td>
          <td>{projectDetails.numAppVisits}</td>
        </tr>
        <tr>
          <td>
            <span className="emoji eyes" />
            Total code views
          </td>
          <td>{projectDetails.numUniqueEditorVisits}</td>
        </tr>
        <tr>
          <td>
            <span className="emoji microphone" />
            Total direct remixes
          </td>
          <td>{projectDetails.numDirectRemixes}</td>
        </tr>
        <tr>
          <td>
            <span className="emoji microphone" />
            Total remixes
          </td>
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
}

const ProjectRemixItem = ({remix}) => {
  // should i expose more info (dates, views, users, remixes), or be more visually impactful with a grid of imgs?
  // impact vs substance (ppl are Actually using these)
  let projectAvatar = avatarUrl(remix.id)
  let projectUrl = `/~${remix.domain}`
  return (
    <a href={projectUrl}>
      <img src={projectAvatar} />
    </a>
  )
}

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
            />
            <h4>Latest Remixes</h4>
            { this.state.projectRemixes.map(remix => (
              <ProjectRemixItem
                key = {remix.id}
                remix = {remix}
              />
            ))}
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
