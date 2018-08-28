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
          style={{backgroundColor: collectionColor, borderBottomColor:categoryColor}}
          data-track="project" data-track-label={project.domain}>
          <div className="project-container">
            <img className="avatar" src={getAvatarUrl(project.id)} alt={`${project.domain} avatar`}/>
            <div className="button">
              <span className="project-badge private-project-badge" aria-label="private"></span>
              <div className="project-name">{project.domain}</div>
            </div>
            <div className="description"><TruncatedMarkdown length={96}>{project.description}</TruncatedMarkdown></div>
            <div className="overflow-mask" style={{backgroundColor: categoryColor}}></div>
          </div>
        </div>
      </a>
    </li>
  );
};

ProjectItem.propTypes = {
  project: PropTypes.shape({
    description: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    private: PropTypes.bool.isRequired,
    showAsGlitchTeam: PropTypes.bool.isRequired,
    users: PropTypes.array.isRequired,
  }).isRequired,
  categoryColor: PropTypes.string,
  projectOptions: PropTypes.object,
};


export default ProjectItem;