import React from 'react';
import PropTypes from 'prop-types';

import {CurrentUserConsumer} from '../current-user.jsx';
import Notifications from '../notifications.jsx';

const AddProjectMessage = (projectName, collectionName) => (
  <React.Fragment>
    <p>Added ProjectName to CollectionName</p>
    <a href="#" className="button button-small button-tertiary button-in-notification-container">Take me there</a>
  </React.Fragment>
);
AddProjectMessage.propTypes = {
  projectName: PropTypes.string.isRequired,
  collectionName: PropTypes.string.isRequired
};

class AddProjectToCollection extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      ...props
    }
  }
  componentDidMount() {
    const content = AddProjectMessage(this.props.projectName, this.props.collectionName);
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
  projectName: PropTypes.string.isRequired,
  collectionName: PropTypes.string.isRequired
};

const AddProjectToCollectionContainer = () => (
  <CurrentUserConsumer>
    {() => (
      <Notifications className="add-project-to-collection-notify">
        {notifyFuncs => (
          <AddProjectToCollection {...notifyFuncs}/>
        )}
      </Notifications>
    )}
  </CurrentUserConsumer>
);

export default AddProjectToCollectionContainer;