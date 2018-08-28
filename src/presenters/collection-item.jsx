import React from 'react';
import PropTypes from 'prop-types';

import {getAvatarUrl, getLink} from '../models/collection.js';

import {TruncatedMarkdown} from './includes/markdown.jsx';
// import ProjectOptionsContainer from "./pop-overs/project-options-pop.jsx";
import UsersList from "./users-list.jsx";

export const CollectionItem = ({collection, collectionColor, projectOptions}) => {
  return (
    <li>
      <UsersList glitchTeam={collection.showAsGlitchTeam} users={collection.users} extraClass="single-line"/>
      {/* TO DO: add options for collections */}
      {/* <ProjectOptionsContainer project={project} projectOptions={projectOptions}></ProjectOptionsContainer> */}

      <a href={getLink(collection.users[0], collection.domain)}>
        <div className={['collection'].join(' ')} 
          style={{backgroundColor: collectionColor}}
          data-track="collection" data-track-label={collection.domain}>
          <div className="collection-container">
            <img className="avatar" src={getAvatarUrl(collection.id)} alt={`${collection.domain} avatar`}/>
            <div className="button">
              <span className="project-badge private-project-badge" aria-label="private"></span>
              <div className="project-name">{collection.domain}</div>
            </div>
            <div className="description"><TruncatedMarkdown length={96}>{collection.description}</TruncatedMarkdown></div>
            <div className="overflow-mask" style={{backgroundColor: collectionColor}}></div>
          </div>
        </div>
      </a>
    </li>
  );
};

CollectionItem.propTypes = {
  collection: PropTypes.shape({
    description: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    private: PropTypes.bool.isRequired,
    // showAsGlitchTeam: PropTypes.bool.isRequired,
    users: PropTypes.array.isRequired,
  }).isRequired,
  collectionColor: PropTypes.string,
  // projectOptions: PropTypes.object,
};


export default CollectionItem;