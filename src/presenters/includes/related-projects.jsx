import React from 'react';
import PropTypes from 'prop-types';

import {CoverContainer} from './profile.jsx';
import {ProjectsUL} from '../projects-list.jsx';

const RelatedProjectsList = ({
  coverStyle, projects
}) => (
  <CoverContainer style={coverStyle}>
    <ProjectsUL projects={projects}/>
  </CoverContainer>
);

class RelatedUserProjects extends React.Component {
  constructor({...props}) {
    super(props);
    console.log(...props);
  }
  
  render() {
    return <RelatedProjectsList coverStyle={this.props.profileStyle}
}

const RelatedProjects = ({users}) => (
  <ul className="related-projects">
    {users.map(({id, profileStyle, projects}) =>
      <li key={id}>
        <RelatedProjectsList coverStyle={profileStyle} projects={projects}/>
      </li>
    )}
  </ul>
);
RelatedProjects.propTypes = {
  users: PropTypes.array.isRequired,
};
export default RelatedProjects;