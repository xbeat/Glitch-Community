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

class RelatedProjectsLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: sampleSize(,
    };
  }
  
  render() {
    const {users, pending} = this.state;
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
        {!!pending.length && <Loader/>}
      </React.Fragment>
    );
  }
}
RelatedProjectsLoader.propTypes = {
  getUserPinnedProjects: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
};
export default RelatedProjectsLoader;