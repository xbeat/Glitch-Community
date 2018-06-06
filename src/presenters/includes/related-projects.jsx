import React from 'react';
import PropTypes from 'prop-types';

import {CoverContainer} from './profile.jsx';

const ProjectList = ({
  id, avatarStyle, coverStyle, projects
}) => (
  <CoverContainer style={coverStyle}>{id}</CoverContainer>
);

const RelatedProjects = ({users}) => (
  <ul className="related-projects">
    {users.map(user =>
      <li key={user.id}>
        <ProjectList {...user}/>
      </li>
    )}
  </ul>
);
RelatedProjects.propTypes = {
  users: PropTypes.array.isRequired,
};
export default RelatedProjects;