import React from 'react';
import PropTypes from 'prop-types';
import {sampleSize} from 'lodash';

import {DataLoader} from './loader.jsx';
import {CoverContainer} from './profile.jsx';
import {ProjectsUL} from '../projects-list.jsx';

class RelatedProjectsList extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      projectIds: sampleSize(props.projectIds, 3),
    };
  }
  
  render() {
    const {
      name, url, coverStyle,
    } = this.props;
    const {
      projectIds,
    } = this.state;
    return (
      <React.Fragment>
        <h2><a href={url}>More by {name} →</a></h2>
        <CoverContainer style={coverStyle}>
          <div className="projects">
            {JSON.stringify(projectIds)}
          </div>
        </CoverContainer>
      </React.Fragment>
    );
  }
}

class RelatedProjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: this.props.users, //todo: filter dupe projects, drop users with no projects
    };
  }
  
  render() {
    const {users} = this.state;
    return !!users.length && (
      <ul className="related-projects">
        {users.map(({owner: {id, ...owner}, projectIds}) =>
          <li key={id}>
            <RelatedProjectsList {...owner} projectIds={projectIds} getProjects/>
          </li>
        )}
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
      projectIds: pins.map(pin => pin.projectId),
      owner: {
        id: user.id,
        name: user.name || user.login || user.tooltipName,
        url: user.userLink,
        coverStyle: user.profileStyle,
      },
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