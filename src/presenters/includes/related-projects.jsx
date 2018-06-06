import React from 'react';
import PropTypes from 'prop-types';

import {CoverContainer} from './profile.jsx';
import {ProjectsUL} from '../projects-list.jsx';

const RelatedProjectsList = ({
  name, url, coverStyle, projects
}) => (
  <React.Fragment>
    <h2><a href={url}>More by {name} →</a></h2>
    <CoverContainer style={coverStyle}>
      <ProjectsUL projects={projects}/>
    </CoverContainer>
  </React.Fragment>
);

class RelatedUserProjects extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      projects: [],
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
    return <RelatedProjectsList name={tooltipName} url={userLink} coverStyle={profileStyle} projects={projects}/>;
  }
}

const RelatedProjects = ({users}) => (
  <ul className="related-projects">
    {users.map(user =>
      <li key={user.id}>
        <RelatedUserProjects {...user}/>
      </li>
    )}
  </ul>
);
RelatedProjects.propTypes = {
  users: PropTypes.array.isRequired,
};
export default RelatedProjects;