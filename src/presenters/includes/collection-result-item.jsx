import React from 'react';
import PropTypes from 'prop-types';

import Notifications from '../notifications.jsx';

import CollectionAvatar from './collection-avatar.jsx';

const AddProjectMessage = ({projectName, collectionName, url}) => (
  <>
    <p>Added <b><span className="project-name">{projectName}</span></b> to collection <b><span className="collection-name">{collectionName}</span></b></p>
    <a href={url} rel="noopener noreferrer" className="button button-small button-tertiary button-in-notification-container notify-collection-link">Take me there</a>
 
  </>);

AddProjectMessage.propTypes = {
  projectName: PropTypes.string,
  collectionName: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

const addProject = (addProjectToCollection, project, collection, collectionPath, notification, togglePopover) => {

  // add project to collection via api
  addProjectToCollection(project, collection);
  
  // toggle popover
  togglePopover();  
  
  // show notification
  // TO DO - only show this if add project to collection completes successfully
  const content = <AddProjectMessage projectName={project.domain} collectionName={collection.name} url={collectionPath}/>;
  notification(content, "notifySuccess");
};

const CollectionResultItem = ({addProjectToCollection, project, collection, currentUserLogin, isActive, togglePopover}) => {
  let resultClass = "button-unstyled result result-collection";
  if(isActive) {
    resultClass += " active";
  }
  const collectionPath = `/@${currentUserLogin}/${collection.url}`;

  return (
    
    <Notifications>
      {({createNotification}) => ( 
        <div>
          <button className={resultClass} onClick={() => addProject(addProjectToCollection, project, collection, collectionPath, createNotification, togglePopover)} data-project-id={project.id}>
            <div className="avatar" id={"avatar-collection-" + collection.id}>
              <CollectionAvatar backgroundColor={collection.coverColor}/>
            </div>
            <div className="results-info">
              <div className="result-name" title={collection.name}>{collection.name}</div>
              { collection.description.length > 0 && <div className="result-description">{collection.description}</div> }
            </div>
          </button>
          <a href={`${collectionPath}`} className="view-result-link" target="_blank" rel="noopener noreferrer">
            <button className="view-project button-small button-docs">
                  View →
            </button>
          </a>
        </div>
      )}  
    </Notifications>
  );
};

CollectionResultItem.propTypes = {
  addProjectToCollection: PropTypes.func,
  collection: PropTypes.object.isRequired,
  currentUserLogin: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  project: PropTypes.object.isRequired,
  togglePopover: PropTypes.func.isRequired,
};

export default CollectionResultItem;
