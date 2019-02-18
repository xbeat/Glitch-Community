import React from 'react';
import PropTypes from 'prop-types';

import {getLink as getCollectionLink} from '../../models/collection.js';
import Notifications from '../notifications.jsx';
import {AddProjectToCollectionMsg} from '../notifications.jsx';
import {UserAvatar, TeamAvatar} from '../includes/avatar.jsx';
import CollectionAvatar from './collection-avatar.jsx';

const addProject = (addProjectToCollection, project, collection, collectionPath, notification, togglePopover) => {

  try{
    // add project to collection
    addProjectToCollection(project, collection);

    // toggle popover
    togglePopover();  

    // show notification
    const content = <AddProjectToCollectionMsg projectName={project.domain} collectionName={collection.name} url={collectionPath}/>;
    notification(content, "notifySuccess");
  }catch(error){
    console.log('error ', error);
    const content = <p>Something went wrong. Try refreshing and adding the project again.</p>;
    notification(content, "notifyError");
  }
};

const CollectionResultItem = ({onClick, project, collection, isActive, togglePopover}) => {
  let resultClass = "button-unstyled result result-collection";
  if(isActive) {
    resultClass += " active";
  }
  
  const collectionPath = getCollectionLink(collection);
    
  return (    
    <Notifications>
      {({createNotification}) => ( 
        <div>
          <button className={resultClass} onClick={() => addProject(onClick, project, collection, collectionPath, createNotification, togglePopover)} data-project-id={project.id}>
            <div className="avatar" id={"avatar-collection-" + collection.id}>
              <CollectionAvatar color={collection.coverColor}/>
            </div>
            <div className="results-info">
              <div className="result-name" title={collection.name}>{collection.name}</div>
              { collection.description.length > 0 && <div className="result-description">{collection.description}</div> }
              { collection.team && <TeamAvatar team={collection.team}/> }
              { collection.user && <UserAvatar user={collection.user}/> }
            </div>
          </button>
          <a href={collectionPath} className="view-result-link button button-small button-link" target="_blank" rel="noopener noreferrer">
            View →
          </a>
        </div>
      )}  
    </Notifications>
  );
};

CollectionResultItem.propTypes = {
  onClick: PropTypes.func,
  collection: PropTypes.object.isRequired,
  isActive: PropTypes.bool,
  project: PropTypes.object.isRequired,
  togglePopover: PropTypes.func.isRequired,
};

export default CollectionResultItem;