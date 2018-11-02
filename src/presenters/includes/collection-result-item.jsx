import React from 'react';
import PropTypes from 'prop-types';

import {DataLoader} from './loader.jsx';
import Notifications from '../notifications.jsx';

import CollectionAvatar from './collection-avatar.jsx';

const AddProjectMessage = ({projectName, collectionName, url}) => (
  <>
    <p>Added <b><span className="project-name">{projectName}</span></b> to collection <b><span className="collection-name">{collectionName}</span></b></p>
    <a href={url} target="_blank" rel="noopener noreferrer" className="button button-small button-tertiary button-in-notification-container notify-collection-link">Take me there</a>
  </>
);

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

// NOTE: CAN WE PASS CURRENT USER INSTEAD OF DOING AN API REQUEST TO GET THE USER LOGIN HERE?
async function getCollectionUrl(api, userId, collectionUrl){
  const {data} = await api.get(`users/${userId}`);
  const username = data.login;
  let path = `/@${username}/${collectionUrl}`;

  return path;
}

const CollectionResultItem = ({addProjectToCollection, api, project, collection, isActive, togglePopover}) => {
  var resultClass = "button-unstyled result result-collection";
  if(isActive) {
    resultClass += " active";
  }

  return (
    <Notifications>
      {({createNotification}) => (
        <DataLoader get={() => getCollectionUrl(api, collection.userId, collection.url)}>
          {collectionPath => 
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
          }
        </DataLoader>
      )}  
    </Notifications>
  );
};

CollectionResultItem.propTypes = {
  api: PropTypes.func.isRequired,
  addProjectToCollection: PropTypes.func,
  collection: PropTypes.object.isRequired,
  isActive: PropTypes.bool,
  project: PropTypes.object.isRequired,
  togglePopover: PropTypes.func.isRequired,
};

export default CollectionResultItem;

