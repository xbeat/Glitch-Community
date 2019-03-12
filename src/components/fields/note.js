import React from 'react';
import PropTypes from 'prop-types';

import styles from './note.styl';

// TODO: let's move these into components
import { EditableDescription } from '../../presenters/includes/description-field';
import { UserTile } from '../../presenters/users-list';


/**
 * Note Component
 */
const Note = ({
  currentUser, project, update,
}) => {
  if (!project.isAddingANewNote && !project.note) {
    return null;
  }
  
  const color = project.collectionCoverColor;
  return (
    <div>
      <div className={styles.descriptionContainer} style={{ backgroundColor: color, borderColor: color }}>
        <EditableDescription
          description={project.note || ''}
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
    note: PropTypes.string,
    isAddingANewNote: PropTypes.bool,
    collectionCoverColor: PropTypes.string,
  }).isRequired,
  update: PropTypes.func,
};

Note.defaultProps = {
  currentUser: null,
  update: null,
};

export default Note;
