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

const notify = (addProjectToCollection, project, collection, notification, togglePopover) => {
  console.log(`notify with project ${project.id} collection ${collection.id}`);

  // add project to collection via api
  addProjectToCollection(project, collection);
  
  // toggle popover
  togglePopover();
  
  // show notification
  const content = <AddProjectMessage projectName={project.name} collectionName={collection.name} url={collection.url}/>;
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
      {({createNotification}) => (
        <button className={resultClass} onClick={() => notify(addProjectToCollection, project, collection, createNotification, togglePopover)} data-project-id={project.id}>
          <img className="avatar" src={collection.avatarUrl} alt={`Project avatar for ${collection.name}`}/>
          <div className="results-info">
            <div className="result-name" title={collection.name}>{collection.name}</div>
            { collection.description.length > 0 && <div className="result-description">{collection.description}</div> }
          </div>
          <DataLoader
            get={() => getCollectionUrl(api, collection.userId, collection.url)}
          >
            <a href={`/@${collection.user.login}/${collection.url}`} className="view-project-link" target="_blank">
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
  api: PropTypes.func.isRequired,
  addProjectToCollection: PropTypes.func,
  collection: PropTypes.object.isRequired,
  isActive: PropTypes.bool,
  project: PropTypes.object.isRequired,
  togglePopover: PropTypes.func.isRequired,
};

export default CollectionResultItem;

