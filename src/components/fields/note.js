import React from 'react';
import PropTypes from 'prop-types';
import styles from './note.styl';

import { AuthDescription } from '../../presenters/includes/description-field'; // TODO: replace auth description with a component
import { UserTile } from '../../presenters/users-list';

/**
 * Note Component
 */
const Note = ({
  currentUser, project, update,
}) => {
  if (!project.isAddingANewAnnotation && !project.annotation) {
    return null;
  }

  return (
    <div className={styles.annotation}>
      <div className={styles.descriptionContainer}>
        <AuthDescription
          authorized
          description={project.annotation || ''}
          placeholder="Share why you love this app."
          update={update}
          maxLength={75}
        />
      </div>
      <div className={styles.user}>
        <UserTile user={currentUser} />
      </div>
    </div>
  );
};

Note.propTypes = {
  currentUser: PropTypes.object,
  project: PropTypes.shape({
    annotation: PropTypes.string,
    isAddingANewAnnotation: PropTypes.bool,
  }).isRequired,
  update: PropTypes.func,
};

Note.defaultProps = {
  currentUser: null,
  update: null,
};

export default Note;
