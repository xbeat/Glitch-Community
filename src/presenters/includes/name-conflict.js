import React from 'react';
import PropTypes from 'prop-types';

import { CurrentUserConsumer } from '../current-user';
import { Link } from './link';
import { NotificationConsumer } from '../notifications';
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

const NameConflictContainer = () => (
  <CurrentUserConsumer>
    {({ id }) => <NotificationConsumer>{(notifyFuncs) => <NameConflict userId={id} {...notifyFuncs} />}</NotificationConsumer>}
  </CurrentUserConsumer>
);

export default NameConflictContainer;
