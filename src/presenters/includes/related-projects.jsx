import React from 'react';
import PropTypes from 'prop-types';

import {DataLoader} from './loader.jsx';
import {CoverContainer} from './profile.jsx';
import {ProjectsUL} from '../projects-list.jsx';

const RelatedProjectsList = ({
  name, url, coverStyle, projects
}) => (
  <React.Fragment>
    <h2><a href={url}>More by {name} →</a></h2>
    <CoverContainer style={coverStyle}>
      <div className="projects">
        <ProjectsUL projects={projects}/>
      </div>
    </CoverContainer>
  </React.Fragment>
);

class RelatedUserProjects extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      projects: props.projects.slice(0, 3),
    };
  }
  
  render() {
    const {
      tooltipName,
      profileStyle,
      userLink,
    } = this.props;
    const {
      projects,
    } = this.state;
    return !!projects.length && <RelatedProjectsList name={tooltipName} url={userLink} coverStyle={profileStyle} projects={projects}/>;
  }
}

class RelatedProjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: this.props.users.slice(0, 3),
    };
  }
  
  render() {
    const {getUsers} = this.props;
    return (
      <DataLoader get={() => getUsers(this.state.users.map(user => user.id))}>
        {users => (
          <ul className="related-projects">
            {users.map(user =>
              <li key={user.id}>
                <RelatedUserProjects {...user}/>
              </li>
            )}
          </ul>
        )}
      </DataLoader>
    );
  }
}
RelatedProjects.propTypes = {
  getUsers: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
};
export default RelatedProjects;