import React from 'react';
import PropTypes from 'prop-types';
import {sampleSize, difference} from 'lodash';

import {DataLoader} from './loader.jsx';
import {CoverContainer} from './profile.jsx';
import {ProjectsUL} from '../projects-list.jsx';

const PROJECT_COUNT = 3;

const RelatedProjectsHeader = ({name, url}) => (
  <h2><a href={url}>More by {name} →</a></h2>
);
RelatedProjectsHeader.propTypes = {
  name: PropTypes.node.isRequired,
  url: PropTypes.string.isRequired,
};

const RelatedProjectsBody = ({projects, coverStyle}) => (
  projects.length ? (
    <CoverContainer style={coverStyle} className="projects">
      <ProjectsUL projects={projects}/>
    </CoverContainer>
  ) : null
);
RelatedProjectsBody.propTypes = {
  projects: PropTypes.array.isRequired,
};

class RelatedProjects extends React.Component {
  constructor(props) {
    super(props);
    const teams = sampleSize(props.teams, 1);
    const users = sampleSize(props.users, 2 - teams.length);
    this.state = {teams, users};
  }
  
  getProjectIds(id, getPins, getProjects) {
    return getPins(id).then(pins => {
      const pinIds = pins.map(pin => pin.projectId);
      const ids = sampleSize(difference(pinIds, [this.props.ignoreProjectId]), PROJECT_COUNT);
      
      if (ids.length < PROJECT_COUNT) {
        return getProjects(id).then(({projects}) => {
          const allIds = projects.map(({id}) => id);
          const remainingIds = difference(allIds, [this.props.ignoreProjectId, ...ids]);
          return [...ids, ...sampleSize(remainingIds, PROJECT_COUNT - ids.length)];
        });
      }
      
      return ids;
    }).then(projectIds => (
      projectIds.length ? this.props.getProjects(projectIds) : []
    ));
  }
  
  getTeamProjects(id) {
    return this.getProjectIds(id, this.props.getTeamPins, this.props.getTeam);
  }
  
  getUserProjects(id) {
    return this.getProjectIds(id, this.props.getUserPins, this.props.getUser);
  }
  
  render() {
    const {teams, users} = this.state;
    if (!teams.length && !users.length) {
      return null;
    }
    return (
      <ul className="related-projects">
        {teams.map(({id, name, url, teamProfileStyle}) => (
          <li key={id}>
            <RelatedProjectsHeader name={name} url={url}/>
            <DataLoader get={() => this.getTeamProjects(id)}>
              {projects => <RelatedProjectsBody projects={projects} coverStyle={teamProfileStyle}/>}
            </DataLoader>
          </li>
        ))}
        {users.map(({id, name, login, tooltipName, userLink, profileStyle}) => (
          <li key={id}>
            <RelatedProjectsHeader name={name || login || tooltipName} url={userLink}/>
            <DataLoader get={() => this.getUserProjects(id)}>
              {projects => <RelatedProjectsBody projects={projects} coverStyle={profileStyle}/>}
            </DataLoader>
          </li>
        ))}
      </ul>
    );
  }
}
RelatedProjects.propTypes = {
  ignoreProjectId: PropTypes.string.isRequired,
  getTeam: PropTypes.func.isRequired,
  getTeamPins: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
  getUserPins: PropTypes.func.isRequired,
  teams: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
};

export default RelatedProjects;