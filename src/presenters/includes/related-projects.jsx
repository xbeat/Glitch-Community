import React from 'react';
import PropTypes from 'prop-types';
import {sampleSize} from 'lodash';

import Loader from './loader.jsx';
import {CoverContainer} from './profile.jsx';
import {ProjectsUL} from '../projects-list.jsx';

class RelatedProjectsList extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      projects: sampleSize(props.projects, 3),
    };
  }
  
  render() {
    const {
      name, url, coverStyle,
    } = this.props;
    const {
      projects,
    } = this.state;
    return (
      <React.Fragment>
        <h2><a href={url}>More by {name} →</a></h2>
        <CoverContainer style={coverStyle}>
          <div className="projects">
            <ProjectsUL projects={projects}/>
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
      remainingUsers: props.users,
      pendingUsers: [],
      users: [],
    };
  }
  
  componentDidMount
  
  render() {
    const {users, pendingUsers} = this.state;
    return (
      <React.Fragment>
        {!!users.length && (
          <ul className="related-projects">
            {users.map(({id, name, login, tooltipName, userLink, profileStyle, projects}) =>
              <li key={id}>
                <RelatedProjectsList name={name || login || tooltipName} url={userLink} coverStyle={profileStyle} projects={projects}/>
              </li>
            )}
          </ul>
        )}
        {!!pendingUsers.length && <Loader/>}
      </React.Fragment>
    );
  }
}
RelatedProjects.propTypes = {
  getUserPinnedProjects: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
};
export default RelatedProjects;