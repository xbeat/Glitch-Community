import React from 'react';
import PropTypes from 'prop-types';

import {getAvatarUrl} from '../models/project.js';

import {ProjectLink} from './includes/link.jsx';
import {TruncatedMarkdown} from './includes/markdown.jsx';
import ProjectOptionsContainer from "./pop-overs/project-options-pop.jsx";
import UsersList from "./users-list.jsx";

export const ProjectItem = ({project, categoryColor, projectOptions}) => {
  return (
    <li>
      <UsersList glitchTeam={project.showAsGlitchTeam} users={project.users} extraClass="single-line" teams={project.teams}/>
      <ProjectOptionsContainer project={project} projectOptions={projectOptions}></ProjectOptionsContainer>

      <ProjectLink project={project}>
        <div className={['project', project.private ? 'private-project' : ''].join(' ')} 
          style={{backgroundColor: categoryColor, borderBottomColor:categoryColor}}
          data-track="project" data-track-label={project.domain}
        >
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
      </ProjectLink>
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
    teams: PropTypes.array,
  }).isRequired,
  categoryColor: PropTypes.string,
  projectOptions: PropTypes.object,
};


export default ProjectItem;