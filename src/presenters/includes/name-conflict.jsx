import React from 'react';
import PropTypes from 'prop-types';

import {CurrentUserConsumer} from '../current-user.jsx';
import Notifications from 

const NameConflictWarning = ({id}) => (
  <React.Fragment>
    <p>This team has your name!</p>
    <a className="button button-small button-tertiary button-in-notification-container" href={`/user/${id}`}>Go to your profile</a>
  </React.Fragment>
);
NameConflictWarning.propTypes = {
  id: PropTypes.number.isRequired,
};

class NameConflict extends React.Component {
  componentDidMount() {
    const content = NameConflictWarning({id: this.props.userId});
    this.notification = this.props.createPersistentNotification(content);
  }
  
  componentWillUnmount() {
    this.notification.remove();
  }
}
NameConflict.propTypes = {
  userId: PropTypes.number,
};

const NameConflictContainer = () => (
  <Notifications>
    {notifyFuncs => (
      <CurrentUserConsumer>
        {({id}) => <NameConflict userId={id} {...notifyFuncs}/>}
      </CurrentUserConsumer>
    )}
  </Notifications>
);

export default NameConflictContainer;