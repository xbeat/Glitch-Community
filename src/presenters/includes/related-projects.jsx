import React from 'react';
import PropTypes from 'prop-types';
import {sampleSize, without} from 'lodash';

import {DataLoader} from './loader.jsx';
import {CoverContainer} from './profile.jsx';
import {ProjectsUL} from '../projects-list.jsx';

const RelatedProjectsPresenter = ({users, getProjects}) => (
  <ul className="related-projects">
    {users.map(({id, name, url, coverStyle, projectIds}) => (
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
  users: PropTypes.arrayOf(PropTypes.shape({
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
    this.state = {
      users: sampleSize(props.users, 2),
    };
    this.getAllUserPins = this.getAllUserPins.bind(this);
  }
  
  getTeamPins(team) {
    return this.props.getTeamPins(team.id).then(pins => ({
      id: team.id,
      name: user.name || user.login || user.tooltipName,
      url: user.userLink,
      coverStyle: user.profileStyle,
      projectIds: sampleSize(without(pins.map(pin => pin.projectId), this.props.ignoreProjectId), 3),
    }));
  }
  
  getUserPins(user) {
    return this.props.getUserPins(user.id).then(pins => ({
      id: user.id,
      name: user.name || user.login || user.tooltipName,
      url: user.userLink,
      coverStyle: user.profileStyle,
      projectIds: sampleSize(without(pins.map(pin => pin.projectId), this.props.ignoreProjectId), 3),
    }));
  }
  
  getAllPins() {
    return Promise.all(this.state.users.map(
      user => this.getUserPins(user)
    ));
  }
  
  render() {
    return (
      <DataLoader get={this.getAllPins}>
        {users => !!users.length && <RelatedProjectsPresenter users={users} getProjects={this.props.getProjects}/>}
      </DataLoader>
    );
  }
}
RelatedProjects.propTypes = {
  ignoreProjectId: PropTypes.string.isRequired,
  getTeamPins: PropTypes.func.isRequired,
  getUserPins: PropTypes.func.isRequired,
  teams: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
};

export default RelatedProjects;