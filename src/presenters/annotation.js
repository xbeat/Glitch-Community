import React from 'react';
import PropTypes from 'prop-types';

import { AuthDescription } from './includes/description-field';
import { UserTile } from './users-list';

const Annotation = ({
  project, currentUser, update,
}) => {
  if (!project.isAddingANewAnnotation && !project.annotation) {
    return null;
  }

  return (
    <div className="annotation">
      <div className="description-container">
        <AuthDescription
          authorized
          description={project.annotation || ''}
          placeholder="Share why you love this app."
          update={update}
        />
      </div>
      <UserTile user={currentUser} />
    </div>
  );
};

Annotation.propTypes = {
  currentUser: PropTypes.object,
  project: PropTypes.shape({
    annotation: PropTypes.string,
    isAddingANewAnnotation: PropTypes.bool,
  }).isRequired,
  update: PropTypes.func,
};

Annotation.defaultProps = {
  currentUser: null,
  update: null,
};

export default Annotation;
