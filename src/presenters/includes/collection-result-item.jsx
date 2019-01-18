import React from 'react';
import PropTypes from 'prop-types';

import Notifications from '../notifications.jsx';
import {UserAvatar, TeamAvatar} from '../includes/avatar.jsx';
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

  try{
    // add project to collection
    addProjectToCollection(project, collection);

    // toggle popover
    togglePopover();  

    // show notification
    const content = <AddProjectMessage projectName={project.domain} collectionName={collection.name} url={collectionPath}/>;
    notification(content, "notifySuccess");
  }catch(error){
    const content = <p>Something went wrong. Try refreshing and adding the project again.</p>;
    notification(content, "notifyError");
  }
};

const CollectionResultItem = ({api, onClick, project, collection, currentUser, currentUserLogin, isActive, togglePopover}) => {
  let resultClass = "button-unstyled result result-collection";
  if(isActive) {
    resultClass += " active";
  }
  const collectionPath = `/@${currentUserLogin}/${collection.url}`;

  return (
    
    <Notifications>
      {({createNotification}) => ( 
        <div>
          <button className={resultClass} onClick={() => addProject(onClick, project, collection, collectionPath, createNotification, togglePopover)} data-project-id={project.id}>
            <div className="avatar" id={"avatar-collection-" + collection.id}>
              <CollectionAvatar backgroundColor={collection.coverColor}/>
            </div>
            <div className="results-info">
              <div className="result-name" title={collection.name}>{collection.name}</div>
              { collection.description.length > 0 && <div className="result-description">{collection.description}</div> }
              { collection.teamId === -1 ?
                <UserAvatar user={currentUser}/>
                : null
              }
                                                
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
  api: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  collection: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
  currentUserLogin: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  project: PropTypes.object.isRequired,
  togglePopover: PropTypes.func.isRequired,
};

export default CollectionResultItem;

async function getTeam(api, teamId){
  console.log(`attempt to get team ${teamId}`);
  try{
    const {team} = await api.get(`/teams/${teamId}`);
    console.log("team %O", team);
    return team;
  }catch(error){
    console.log(error);
  }
}

async function getUser(api, userId){
  console.log(`attempt to get user ${userId}`);
  try{
    const {user} = await api.get(`/users/${userId}`);
    console.log("user %O", user);
    return user;
  }catch(error){
    console.log(error);
  }
}