import React from 'react';
import PropTypes from 'prop-types';

<<<<<<< HEAD
import {getLink as getCollectionLink} from '../../models/collection.js';
import Notifications from '../notifications.jsx';
import {AddProjectToCollectionMsg} from '../notifications.jsx';
import {UserAvatar, TeamAvatar} from '../includes/avatar.jsx';
import CollectionAvatar from './collection-avatar.jsx';

const addProject = (addProjectToCollection, project, collection, collectionPath, notification, togglePopover) => {
  // add project to collection
  addProjectToCollection(project, collection).then(() => {
    // show notification
    const content = <AddProjectToCollectionMsg projectDomain={project.domain} collectionName={collection.name} url={collectionPath}/>;
    notification(content, "notifySuccess");
  });

  togglePopover();  
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
=======
import { NotificationConsumer } from '../notifications';

import CollectionAvatar from './collection-avatar';

const AddProjectMessage = ({ projectName, collectionName, url }) => (
  <>
    <p>
      Added
      {' '}
      <b>
        <span className="project-name">{projectName}</span>
      </b>
      {' '}
      to collection
      {' '}
      <b>
        <span className="collection-name">{collectionName}</span>
      </b>
    </p>
    <a
      href={url}
      rel="noopener noreferrer"
      className="button button-small button-tertiary button-in-notification-container notify-collection-link"
    >
      Take me there
    </a>
  </>
);

AddProjectMessage.propTypes = {
  projectName: PropTypes.string.isRequired,
  collectionName: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

const addProject = (
  addProjectToCollection,
  project,
  collection,
  collectionPath,
  notification,
  togglePopover,
) => {
  try {
    // add project to collection via api
    addProjectToCollection(project, collection);

    // toggle popover
    togglePopover();

    // show notification
    const content = (
      <AddProjectMessage
        projectName={project.domain}
        collectionName={collection.name}
        url={collectionPath}
      />
    );
    notification(content, 'notifySuccess');
  } catch (error) {
    const content = (
      <p>Something went wrong. Try refreshing and adding the project again.</p>
    );
    notification(content, 'notifyError');
  }
};

const CollectionResultItem = ({
  onClick,
  project,
  collection,
  currentUserLogin,
  isActive,
  togglePopover,
}) => {
  let resultClass = 'button-unstyled result result-collection';
  if (isActive) {
    resultClass += ' active';
  }
  const collectionPath = `/@${currentUserLogin}/${collection.url}`;

  return (
    <NotificationConsumer>
      {({ createNotification }) => (
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
        <div>
          <button
            className={resultClass}
            onClick={() => addProject(
              onClick,
              project,
              collection,
              collectionPath,
              createNotification,
              togglePopover,
            )
            }
            data-project-id={project.id}
          >
            <div className="avatar" id={`avatar-collection-${collection.id}`}>
              <CollectionAvatar color={collection.coverColor} />
            </div>
            <div className="results-info">
<<<<<<< HEAD
              <div className="result-name" title={collection.name}>{collection.name}</div>
              { collection.description.length > 0 && <div className="result-description">{collection.description}</div> }
              { collection.team && <TeamAvatar team={collection.team}/> }
              { collection.user && <UserAvatar user={collection.user}/> }
=======
              <div className="result-name" title={collection.name}>
                {collection.name}
              </div>
              {collection.description.length > 0 && (
                <div className="result-description">
                  {collection.description}
                </div>
              )}
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
            </div>
          </button>
          <a
            href={collectionPath}
            className="view-result-link button button-small button-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            View →
          </a>
        </div>
      )}
    </NotificationConsumer>
  );
};

CollectionResultItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  collection: PropTypes.object.isRequired,
  isActive: PropTypes.bool,
  project: PropTypes.object.isRequired,
  togglePopover: PropTypes.func.isRequired,
};

<<<<<<< HEAD
export default CollectionResultItem;
=======
CollectionResultItem.defaultProps = {
  isActive: false,
};

export default CollectionResultItem;
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
