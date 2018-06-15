import React from 'react';
import PropTypes from 'prop-types';
import {sampleSize, difference} from 'lodash';

import {DataLoader} from './loader.jsx';
import {CoverContainer} from './profile.jsx';
import {ProjectsUL} from '../projects-list.jsx';

const PROJECT_COUNT = 3;

const RelatedProjectsPresenter = ({groups, getProjects}) => (
  <ul className="related-projects">
    {groups.map(({id, name, url, coverStyle, projectIds}) => (
      <li key={id}>
        <h2><a href={url}>More by {name} →</a></h2>
        {!!projectIds.length && (
          <DataLoader get={() => getProjects(projectIds)}>
            {projects => (
              <CoverContainer style={coverStyle} className="projects">
                <ProjectsUL projects={projects}/>
              </CoverContainer>
            )}
          </DataLoader>
        )}
      </li>
    ))}
  </ul>
);
RelatedProjectsPresenter.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.node.isRequired,
    name: PropTypes.node.isRequired,
    url: PropTypes.string.isRequired,
    coverStyle: PropTypes.object.isRequired,
    projectIds: PropTypes.arrayOf(
      PropTypes.string.isRequired
    ).isRequired,
  }).isRequired).isRequired,
  getProjects: PropTypes.func.isRequired,
};

class RelatedProjects extends React.Component {
  constructor(props) {
    super(props);
    const teams = sampleSize(props.teams, 1);
    const users = sampleSize(props.users, 2 - teams.length);
    this.state = {teams, users};
    this.getAllProjectIds = this.getAllProjectIds.bind(this);
  }
  
  getProjectIds(getPins, getProjects) {
    return getPins().then(pins => {
      const pinIds = pins.map(pin => pin.projectId);
      const ids = sampleSize(difference(pinIds, [this.props.ignoreProjectId]), PROJECT_COUNT);
      
      if (ids.length < PROJECT_COUNT) {
        return getProjects().then(({projects}) => {
          const allIds = projects.map(({id}) => id);
          const remainingIds = difference(allIds, [this.props.ignoreProjectId, ...ids]);
          return [...ids, ...sampleSize(remainingIds, PROJECT_COUNT - ids.length)];
        });
      }
      
      return ids;
    });
  }
  
  getTeamProjectIds({id, name, url, teamProfileStyle}) {
    return this.getProjectIds(
      () => this.props.getTeamPins(id),
      () => this.props.getTeam(id),
    ).then(projectIds => ({
      id, name, url,
      coverStyle: teamProfileStyle,
      projectIds,
    }));
  }
  
  getUserProjectIds({id, name, login, tooltipName, userLink, profileStyle}) {
    return this.getProjectIds(
      () => this.props.getUserPins(id),
      () => this.props.getUser(id),
    ).then(projectIds => ({
      id,
      name: name || login || tooltipName,
      url: userLink,
      coverStyle: profileStyle,
      projectIds,
    }));
  }
  
  getAllProjectIds() {
    return Promise.all(
      this.state.teams.map(team => this.getTeamProjectIds(team)).concat(
        this.state.users.map(user => this.getUserProjectIds(user))
      )
    );
  }
  
  render() {
    return (
      <DataLoader get={this.getAllProjectIds}>
        {groups => !!groups.length && <RelatedProjectsPresenter groups={groups} getProjects={this.props.getProjects}/>}
      </DataLoader>
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