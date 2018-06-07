import React from 'react';
import PropTypes from 'prop-types';
import {sampleSize, without} from 'lodash';

import {DataLoader} from './loader.jsx';
import {CoverContainer} from './profile.jsx';
import {ProjectsUL} from '../projects-list.jsx';

const RelatedProjectsPresenter = ({users}) => (
  <ul className="related-projects">
    {users.map(({id, name, url, coverStyle, projectIds}) => (
      <li key={id}>
        <h2><a href={url}>More by {name} →</a></h2>
        {!!projectIds.length && (
          <DataLoader get={() => this.props.getProjects(projectIds)}>
            {projects => (
              <CoverContainer style={coverStyle}>
                <div className="projects">
                  <ProjectsUL projects={projects}/>
                </div>
              </CoverContainer>
            )}
          </DataLoader>
        )}
      </li>
    ))}
  </ul>
);
RelatedProjectsPresenter.propTypes = {
  users: PropTypes.arrayOf({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    coverStyle: PropTypes.object.isRequired,
    projectIds: PropTypes.arrayOf(
      PropTypes.string.isRequired
    ).isRequired,
  }).isRequired,
  getProjects: PropTypes.func.isRequired,
};

class RelatedProjects extends React.Component {
  constructor(props) {
    super(props);
    const {ignoreProjectId, users} = props;
    this.state = {
      users: sampleSize(users, 3).map(({projectIds, ...user}) => ({
        projectIds: sampleSize(without(projectIds, ignoreProjectId), 3),
        ...user,
      })),
    };
    this.getAllUserPins = this.getAllUserPins.bind(this);
  }
  
  getUserPins(user) {
    return this.props.getUserPins(user.id).then(pins => ({
      id: user.id,
      name: user.name || user.login || user.tooltipName,
      url: user.userLink,
      coverStyle: user.profileStyle,
      projectIds: pins.map(pin => pin.projectId),
    }));
  }
  
  getAllUserPins() {
    return Promise.all(this.state.users.map(
      user => this.getUserPins(user)
    ));
  }
  
  render() {
    return (
      <DataLoader get={this.getAllUserPins}>
        {users => !!users.length && <RelatedProjectsPresenter users={users} getProjects={this.props.getProjects}/>}
      </DataLoader>
    );
  }
}
RelatedProjects.propTypes = {
  ignoreProjectId: PropTypes.string.isRequired,
  getUserPins: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
};
RelatedProjects.defaultProps = {
  ignoreProjects: [],
};

export default RelatedProjects;