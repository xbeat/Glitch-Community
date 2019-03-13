import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './note.styl';

// TODO: let's move these into components
import { EditableDescription } from '../../presenters/includes/description-field';
import { UserTile } from '../../presenters/users-list';

import { isDarkColor } from '../../models/collection';

const cx = classNames.bind(styles);
/**
 * Note Component
 */
const Note = ({
  collectionCoverColor, currentUser, project, update,
}) => {
  if (!project.isAddingANewNote && !project.note) {
    return null;
  }

  const className = cx({
    descriptionContainer: true,
    dark: isDarkColor(collectionCoverColor),
  });

  return (
    <div>
      <div className={className} style={{ backgroundColor: collectionCoverColor, borderColor: collectionCoverColor }}>
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
  collectionCoverColor: PropTypes.string.isRequired,
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
