import React from 'react';
import PropTypes from 'prop-types';

import Loader, {DataLoader} from './loader.jsx';
import Notifications from '../notifications.jsx';

const AddProjectMessage = ({projectName, collectionName, url}) => (
  <React.Fragment>
    <p>Added <b><span className="project-name">{projectName}</span></b> to collection <b><span className="collection-name">{collectionName}</span></b></p>
    <a href={url} target="_blank" className="button button-small button-tertiary button-in-notification-container notify-collection-link">Take me there</a>
  </React.Fragment>
);
AddProjectMessage.propTypes = {
  projectName: PropTypes.string.isRequired,
  collectionName: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

const addProject = (addProjectToCollection, project, collection, collectionPath, notification, togglePopover) => {

  // add project to collection via api
  addProjectToCollection(project, collection);
  
  // toggle popover
  togglePopover();
  
  // reload the corresponding collection on the user profile page
  console.log('attempt to update parent collection');
  let collectionSelector = "collection-" + collection.id;
  document.getElementbyId(collectionSelector).forceUpdate();
  
  // show notification
  // TO DO - only show this if add project to collection completes successfully
  const content = <AddProjectMessage projectName={project.domain} collectionName={collection.name} url={collectionPath}/>;
  notification(content, "notifySuccess");
};

async function getCollectionUrl(api, userId, collectionUrl){
  const {data} = await api.get(`users/${userId}`);
  const username = data.login;
  let path = `/@${username}/${collectionUrl}`;
  // console.log(`path: ${path}`);
  return path;
}

const CollectionResultItem = ({addProjectToCollection, api, project, collection, isActive, togglePopover}) => {
  var resultClass = "button-unstyled result result-collection";
  if(isActive) {
    resultClass += " active";
  }

  return (
    <Notifications>
      {({createPersistentNotification}) => (
        <DataLoader get={() => getCollectionUrl(api, collection.userId, collection.url)}>
          {collectionPath => 
            <button className={resultClass} onClick={() => addProject(addProjectToCollection, project, collection, collectionPath, createPersistentNotification, togglePopover)} data-project-id={project.id}>
              <div className="avatar">
                <img src={collection.avatarUrl} className="avatar" alt={`Project avatar for ${collection.name}`}/>
              </div>
              <div className="results-info">
                <div className="result-name" title={collection.name}>{collection.name}</div>
                { collection.description.length > 0 && <div className="result-description">{collection.description}</div> }
              </div>
              <a href={`${collectionPath}`} className="view-project-link" target="_blank">
                <button className="view-project button-small button-docs">
                      View →
                </button>
              </a>
            </button>
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

