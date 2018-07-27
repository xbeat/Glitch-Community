import React from 'react';
import PropTypes from 'prop-types';
import {sampleSize, difference} from 'lodash';

import {getProfileStyle as getTeamProfileStyle} from '../../models/team';
import {getProfileStyle as getUserProfileStyle} from '../../models/user';

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
  
  getProjects(id, getPins, getProjects) {
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
  
  render() {
    const {getTeam, getTeamPins, getUser, getUserPins} = this.props;
    const {teams, users} = this.state;
    if (!teams.length && !users.length) {
      return null;
    }
    return (
      <ul className="related-projects">
        {teams.map(({id, name, url, ...team}) => (
          <li key={id}>
            <RelatedProjectsHeader name={name} url={`/@${url}`}/>
            <DataLoader get={() => this.getProjects(id, getTeamPins, getTeam)}>
              {projects => <RelatedProjectsBody projects={projects} coverStyle={getTeamProfileStyle({id, ...team})}/>}
            </DataLoader>
          </li>
        ))}
        {users.map(({id, name, login, tooltipName, userLink, ...user}) => (
          <li key={id}>
            <RelatedProjectsHeader name={name || login || tooltipName} url={userLink}/>
            <DataLoader get={() => this.getProjects(id, getUserPins, getUser)}>
              {projects => <RelatedProjectsBody projects={projects} coverStyle={getUserProfileStyle({id, ...user})}/>}
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