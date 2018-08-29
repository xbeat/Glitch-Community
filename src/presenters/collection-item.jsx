import React from 'react';
import PropTypes from 'prop-types';

import {getAvatarUrl, getLink} from '../models/project.js';

import {TruncatedMarkdown} from './includes/markdown.jsx';
import ProjectOptionsContainer from "./pop-overs/project-options-pop.jsx";
import UsersList from "./users-list.jsx";

const colors = ["rgba(84,248,214,0.40)", "rgba(229,229,229,0.40)", "rgba(255,163,187,0.40)", "rgba(251,160,88,0.40)", "rgba(252,243,175,0.40)", "rgba(48,220,166,0.40)", 
               "rgba(103,190,255,0.40)", "rgba(201,191,244,0.40)"];

export const CollectionItem = ({project, categoryColor, projectOptions}) => {
  let randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  return (
    <li>
      <UsersList glitchTeam={project.showAsGlitchTeam} users={project.users} extraClass="single-line"/>
      <ProjectOptionsContainer project={project} projectOptions={projectOptions}></ProjectOptionsContainer>

        <div className={['collection', project.private ? 'private-project' : ''].join(' ')} 
          style={{backgroundColor: randomColor, borderBottomColor:randomColor}}
          data-track="project" data-track-label={project.domain}>
          <div className="collection-container">
            
            <div className="collection-info">
              <img className="avatar" src={getAvatarUrl(project.id)} alt={`${project.domain} avatar`}/>
              <div className="collection-name-description">
                <div className="button helloWorld">
                  <span className="project-badge private-project-badge" aria-label="private"></span>
                  <div className="project-name">{project.domain}</div>
                </div>
                <div className="description"><TruncatedMarkdown length={96}>{project.description}</TruncatedMarkdown></div>
              </div>
              
              <div className="overflow-mask"></div>
            </div>
            
            <div className="projects-preview">
              <div className="project-container">
                <img className="avatar" src={getAvatarUrl(project.id)} alt={`${project.domain} avatar`}/>
                <div className="project-name">{project.domain}</div>
              </div>

              <div className="project-container">
                <img className="avatar" src={getAvatarUrl(project.id)} alt={`${project.domain} avatar`}/>
                <div className="project-name">{project.domain}</div>
              </div>

              <div className="project-container">
                <img className="avatar" src={getAvatarUrl(project.id)} alt={`${project.domain} avatar`}/>
                <div className="project-name">{project.domain}</div>
              </div>

            </div>
            
            <div className="collection-link">
              <a href="#">
                View all {Math.floor(Math.random() * 10)+3} projects →
              </a>            
            </div>
            
          </div>
        </div>
    </li>
  );
};

CollectionItem.propTypes = {
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


export default CollectionItem;