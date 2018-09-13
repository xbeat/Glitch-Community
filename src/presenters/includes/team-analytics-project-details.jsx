import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-mini';

import {ProjectLink} from './link.jsx';
import Loader from './loader.jsx';
import {FALLBACK_AVATAR_URL, getAvatarUrl} from '../../models/project.js';

const RECENT_REMIXES_COUNT = 100;

const getProjectDetails = async ({id, api, currentProjectDomain}) => {
  let path = `analytics/${id}/project/${currentProjectDomain}/overview`;
  try {
    return await api().get(path);
  } catch (error) {
    console.error('getProjectDetails', error);
  }
};

const addFallbackSrc = (event) => {
  event.target.src = FALLBACK_AVATAR_URL;
};

const ProjectDetails = ({projectDetails}) => {
  let projectAvatar = getAvatarUrl(projectDetails.id);
  return (
    <article className="project-details">
      <ProjectLink project={projectDetails}>
        <img className="avatar" src={projectAvatar} onError={addFallbackSrc} alt="project avatar" />
      </ProjectLink>
      <table>
        <tbody>
          <tr>
            <td className="label">Created</td>
            <td>{moment(projectDetails.createdAt).fromNow()}</td>
          </tr>
          <tr>
            <td className="label">Last code view</td>
            <td>{moment(projectDetails.lastAccess).fromNow()}</td>
          </tr>
          <tr>
            <td className="label">Last edited</td>
            <td>{moment(projectDetails.lastEditedAt).fromNow()}</td>
          </tr>
          <tr>
            <td className="label">Last remixed</td>
            <td>{moment(projectDetails.lastRemixedAt).fromNow()}</td>
          </tr>
          <tr>
            <td className="label">Total app views</td>
            <td>{projectDetails.numAppVisits}</td>
          </tr>
          <tr>
            <td className="label">Total code views</td>
            <td>{projectDetails.numUniqueEditorVisits}</td>
          </tr>
          <tr>
            <td className="label">Total direct remixes</td>
            <td>{projectDetails.numDirectRemixes}</td>
          </tr>
          <tr>
            <td className="label">Total remixes</td>
            <td>{projectDetails.numTotalRemixes}</td>
          </tr>
          { (projectDetails.baseProject.domain) &&
            <tr>
              <td className="label">Originally remixed from</td>
              <td>
                <ProjectLink project={projectDetails.baseProject}>
                  <img alt="project avatar" className="avatar baseproject-avatar" src={getAvatarUrl(projectDetails.baseProject.id)} onError={addFallbackSrc} />
                </ProjectLink>
                {projectDetails.baseProject.domain}
              </td>
            </tr>
          }
        </tbody>
      </table>
    </article>
  );
};

const ProjectRemixItem = ({remix}) => {
  let projectAvatar = getAvatarUrl(remix.id);
  return (
    <ProjectLink project={remix}>
      <span data-tooltip={remix.domain} data-tooltip-left="true">
        <img className="avatar" src={projectAvatar} alt={remix.domain} onError={addFallbackSrc} />
      </span>
    </ProjectLink>
  );
};

class TeamAnalyticsProjectDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGettingData: true,
      projectDetails: {},
      projectRemixes: [],
    };
  }

  updateProjectDetails() {
    this.setState({
      isGettingData: true
    }); 
    getProjectDetails(this.props).then(({data}) => {
      this.setState({
        isGettingData: false,
        projectDetails: data,
        projectRemixes: data.remixes.slice(0, RECENT_REMIXES_COUNT),
      });
    });
  }
  
  componentDidMount() {
    this.updateProjectDetails();
  }
  
  componentDidUpdate(prevProps) {
    if (this.props.currentProjectDomain !== prevProps.currentProjectDomain) {
      this.updateProjectDetails();
    }
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
            { (this.state.projectRemixes.length === 0) &&
              <p>No remixes yet (／_^)／ ●</p>
            }
            { this.state.projectRemixes.map(remix => (
              <ProjectRemixItem
                key = {remix.id}
                remix = {remix}
              />
            ))}
          </React.Fragment>
        }
      </React.Fragment>
    );
  }
}

TeamAnalyticsProjectDetails.propTypes = {
  currentProjectDomain: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  api: PropTypes.func.isRequired,
};

export default TeamAnalyticsProjectDetails;
