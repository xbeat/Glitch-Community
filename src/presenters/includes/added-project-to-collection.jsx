import React from 'react';
import PropTypes from 'prop-types';

import {CurrentUserConsumer} from '../current-user.jsx';
import Notifications from '../notifications.jsx';

const AddProjectMessage = () => (
  <div className="notify">
    <p>Added ProjectName to CollectionName</p>
    <a href="#" className="button button-small button-tertiary button-in-notification-container">Take me there</a>
  </div>
);
AddProjectMessage.propTypes = {
  // id: PropTypes.number.isRequired,
};

class AddProjectToCollection extends React.Component {
  componentDidMount() {
    const content = AddProjectMessage();
    this.notification = this.props.createPersistentNotification(content);
  }
  
  componentWillUnmount() {
    this.notification.removeNotification();
  }
  
  render() {
    return null;
  }
}
AddProjectToCollection.propTypes = {
  createPersistentNotification: PropTypes.func.isRequired,
};

const AddProjectToCollectionContainer = () => (
  <CurrentUserConsumer>
    {() => (
      <Notifications>
        {notifyFuncs => (
          <AddProjectToCollection {...notifyFuncs}/>
        )}
      </Notifications>
    )}
  </CurrentUserConsumer>
);

export default AddProjectToCollectionContainer;