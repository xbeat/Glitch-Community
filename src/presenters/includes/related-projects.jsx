import React from 'react';
import PropTypes from 'prop-types';

import {CoverContainer} from './profile.jsx';

const ProjectList = ({
  id, coverStyle
}) => (
  <CoverContainer style={coverStyle}>{id}</CoverContainer>
);

const RelatedProjects = ({users}) => (
  <ul className="related-projects">
    {users.map(({id, profileStyle}) =>
      <li key={id}>
        <ProjectList id={id} coverStyle={profileStyle}/>
      </li>
    )}
  </ul>
);
RelatedProjects.propTypes = {
  users: PropTypes.array.isRequired,
};
export default RelatedProjects;