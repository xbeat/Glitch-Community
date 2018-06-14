import React from 'react';
import PropTypes from 'prop-types';
import {sampleSize, without} from 'lodash';

import {DataLoader} from './loader.jsx';
import {CoverContainer} from './profile.jsx';
import {ProjectsUL} from '../projects-list.jsx';

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
    this.getAllPins = this.getAllPins.bind(this);
  }
  
  selectProjects(ids) {
    return sampleSize(without(ids, this.props.ignoreProjectId), 3);
  }
  
  getTeamProjectIds(team) {
    return this.props.getTeamPins(team.id).then(pins => ({
      id: team.id,
      name: team.name,
      url: team.url,
      coverStyle: team.teamProfileStyle,
      projectIds: this.selectProjects(pins),
    }));
  }
  
  getUserProjectIds(user) {
    const data = {
      id: user.id,
      name: user.name || user.login || user.tooltipName,
      url: user.userLink,
      coverStyle: user.profileStyle,
    };
    return this.props.getUserPins(user.id).then(pins => {
      return without(pins.map(pin => pin.projectId), this.props.ignoreProjectId);
    });
  }
  
  getAllPins() {
    return Promise.all(
      this.state.teams.map(team => this.getTeamProjectIds(team)).concat(
        this.state.users.map(user => this.getUserProjectIds(user))
      )
    );
  }
  
  render() {
    return (
      <DataLoader get={this.getAllPins}>
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