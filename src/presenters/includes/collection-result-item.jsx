import React from 'react';
import PropTypes from 'prop-types';

import {getAvatarUrl} from  '../../models/project';

import Notifications from '../notifications.jsx';

const AddProjectMessage = ({projectName, collectionName}) => (
  <React.Fragment>
    <p>Added <b><span className="project-name">{projectName}</span></b> to collection <b><span className="collection-name">{collectionName}</span></b></p>
    <a href={collectionName} target="_blank" className="button button-small button-tertiary button-in-notification-container notify-collection-link">Take me there</a>
  </React.Fragment>
);
AddProjectMessage.propTypes = {
  projectName: PropTypes.string.isRequired,
  collectionName: PropTypes.string.isRequired
};

const notify = (projectName, collectionName, notification) => {
  console.log(`clicked on ${collectionName}`);
  
  // show notification
  const content = <AddProjectMessage {...{projectName, collectionName}}/>;
  notification(content, "notifySuccess");
};

const CollectionResultItem = ({id, domain, description, isActive, avatarUrl, url, notification}) => {
  var resultClass = "button-unstyled result result-collection";
  if(isActive) {
    resultClass += " active";
  }

  return (
    <button className={resultClass} onClick={() => notify(domain, notification)} data-project-id={id}>
      <img className="avatar" src={avatarUrl} alt={`Project avatar for ${domain}`}/>
      <div className="results-info">
        <div className="result-name" title={domain}>{domain}</div>
        { description.length > 0 && <div className="result-description">{description}</div> }
      </div>
      <a href={`/${url}`} className="view-project-link" target="_blank">
        <button className="view-project button-small button-docs">
          View →
        </button>
      </a>
        
    </button>
  );
};

CollectionResultItem.propTypes = {
  domain: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  avatarUrl: PropTypes.string,
  url: PropTypes.string,
  notification: PropTypes.func,
};

export default CollectionResultItem;

