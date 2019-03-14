import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

// TODO: let's move these into components
import { EditableDescription } from './includes/description-field';
import { UserTile } from './users-list';

import { isDarkColor } from '../models/collection';

/**
 * Note Component
 */
const Note = ({
  collectionCoverColor, currentUser, project, update,
}) => {
  if (!project.isAddingANewNote && !project.note) {
    return null;
  }

  const className = classNames({
    descriptionContainer: true,
    dark: isDarkColor(collectionCoverColor),
  });

  return (
    <div className="note">
      <div className={className} style={{ backgroundColor: collectionCoverColor, borderColor: collectionCoverColor }}>
        <EditableDescription
          description={project.note || ''}
          placeholder="Share why you love this app."
          update={update}
          maxLength={75}
        />
      </div>
      <div className="user">
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
