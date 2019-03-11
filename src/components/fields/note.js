import React from 'react';
import PropTypes from 'prop-types';
import styles from './note.styl';

import { AuthDescription } from '../../presenters/includes/description-field'; // TODO: replace auth description with a component
import { UserTile } from '../../presenters/users-list';

/**
 * Button Component
 */
const Button = ({
  currentUser, project, update,
}) => (
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
    <UserTile user={currentUser} />
  </div>
);

Button.propTypes = {
  currentUser: PropTypes.object,
  project: PropTypes.shape({
    annotation: PropTypes.string,
    isAddingANewAnnotation: PropTypes.bool,
  }).isRequired,
  update: PropTypes.func,
};

Button.defaultProps = {
  currentUser: null,
  update: null,
};

export default Button;
