import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { useCurrentUser } from '../../state/current-user';
import { Link } from './link';
import { useNotifications } from '../notifications';
import Text from '../../components/text/text';

const NameConflictWarning = ({ id }) => (
  <>
    <Text>This team has your name. You should update your info to remain unique ❄</Text>
    <Link className="button button-small button-tertiary button-in-notification-container" to={`/user/${id}`}>
      Your Profile
    </Link>
  </>
);
NameConflictWarning.propTypes = {
  id: PropTypes.number.isRequired,
};

export function useNameConflict() {
  const { currentUser } = useCurrentUser();
  const { createPersistentNotification } = useNotifications();
  useEffect(() => {
    const notification = createPersistentNotification(<NameConflictWarning id={currentUser.id} />);
    return () => {
      notification.removeNotification();
    };
  }, [currentUser.id]);
}

function NameConflict() {
  useNameConflict();
  return null;
}
export default NameConflict;
