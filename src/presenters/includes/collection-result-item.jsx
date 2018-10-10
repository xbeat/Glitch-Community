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

const notify = (addProjectToCollection, project, collection, url, notification, togglePopover) => {
  console.log('notify');

  // add project to collection via api
  addProjectToCollection(project), collection;
  
  // toggle popover
  togglePopover();
  
  // show notification
  const content = <AddProjectMessage projectName={project.name} collectionName={collection.name} {...{url}}/>;
  notification(content, "notifySuccess");
};

const CollectionResultItem = ({addProjectToCollection, id, project, collection,  togglePopover}) => {
  var resultClass = "button-unstyled result result-collection";
  if(isActive) {
    resultClass += " active";
  }

  return (
    <Notifications>
      {({createNotification}) => (
        <button className={resultClass} onClick={() => notify(addProjectToCollection, project, collection, url, createNotification, togglePopover)} data-project-id={id}>
          <img className="avatar" src={avatarUrl} alt={`Project avatar for ${collection.name}`}/>
          <div className="results-info">
            <div className="result-name" title={collection.name}>{collection.name}</div>
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
  addProjectToCollection: PropTypes.func,
  avatarUrl: PropTypes.string,
  collection: PropTypes.object.isRequired,
  description: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  project: PropTypes.object.isRequired,
  url: PropTypes.string,
  togglePopover: PropTypes.func.isRequired,
};

export default CollectionResultItem;

