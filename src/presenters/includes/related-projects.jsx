import React from 'react';
import PropTypes from 'prop-types';
import {sampleSize} from 'lodash';

import {DataLoader} from './loader.jsx';
import {CoverContainer} from './profile.jsx';
import {ProjectsUL} from '../projects-list.jsx';

class RelatedProjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: this.props.users.map(({projectIds, ...user}) => ({
        projectIds: sampleSize(projectIds, 3),
        ...user,
      })),
    };
  }
  
  render() {
    const {users} = this.state;
    return !!users.length && (
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
  }
}

class RelatedProjectsLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: sampleSize(props.users, 3),
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
        {users => <RelatedProjects users={users} getProjects={this.props.getProjects}/>}
      </DataLoader>
    );
  }
}
RelatedProjectsLoader.propTypes = {
  getUserPins: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
};
export default RelatedProjectsLoader;