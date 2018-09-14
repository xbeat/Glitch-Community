import React from 'react';
import PropTypes from 'prop-types';

import {getAvatarUrl} from  '../../models/project';

import Notifications from '../notifications.jsx';

const AddProjectMessage = ({projectName, collectionName, url}) => (
  <React.Fragment>
    <p>Added <b><span className="project-name">{projectName}</span></b> to collection <b><span className="collection-name">{collectionName}</span></b></p>
    <a href={url} target="_blank" className="button button-small button-tertiary button-in-notification-container notify-collection-link">Take me there</a>
  </React.Fragment>
);
AddProjectMessage.propTypes = {
  projectName: PropTypes.string.isRequired,
  collectionName: PropTypes.string.isRequired
};

const notify = (projectName, collectionName, url, notification, togglePopover) => {
  console.log(`clicked on ${collectionName}`);
  // toggle popover
  togglePopover();
  
  // show notification
  const content = <AddProjectMessage {...{projectName, collectionName, url}}/>;
  notification(content, "notifySuccess");
};

const CollectionResultItem = ({id, projectName, collectionName, description, isActive, avatarUrl, url, togglePopover}) => {
  var resultClass = "button-unstyled result result-collection";
  if(isActive) {
    resultClass += " active";
  }

  return (
    <Notifications>
      {({createPersistentNotification}) => (
        <button className={resultClass} onClick={() => notify(projectName, collectionName, url, createPersistentNotification, togglePopover)} data-project-id={id}>
          <img className="avatar" src={avatarUrl} alt={`Project avatar for ${collectionName}`}/>
          <div className="results-info">
            <div className="result-name" title={collectionName}>{collectionName}</div>
            { description.length > 0 && <div className="result-description">{description}</div> }
          </div>
          <a href={`/${url}`} className="view-project-link" target="_blank">
            <button className="view-project button-small button-docs">
              View →
            </button>
          </a>
        </button>
        )}
    </Notifications>
  );
};

CollectionResultItem.propTypes = {
  projectName: PropTypes.string.isRequired,
  collectionName: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  avatarUrl: PropTypes.string,
  url: PropTypes.string,
  togglePopover: PropTypes.array.isRequired,
};

export default CollectionResultItem;

