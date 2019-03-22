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

class NameConflict extends React.Component {
  componentDidMount() {
    const content = NameConflictWarning({ id: this.props.userId });
    this.notification = this.props.createPersistentNotification(content);
  }

  componentWillUnmount() {
    this.notification.removeNotification();
  }

  render() {
    return null;
  }
}
NameConflict.propTypes = {
  createPersistentNotification: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
};

function useNameConflict () {
  const { currentUser } = useCurrentUser();
  const { createPersistentNotification } = useNotifications();
  const ref = useRef(null)
  useEffect(() => {
    ref.current = createPersistentNotification(<NameConflictWarning id={currentUser.id} />)
    return () => {
      if (ref.current) {
        ref.current.removeNotification()
      }
    }
  }, [currentUser.id])
}

function NameConflictContainer () {
  useNameConflict()
  return null
};
export default NameConflictContainer;
