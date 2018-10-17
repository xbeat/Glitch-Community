import React from 'react';
import PropTypes from 'prop-types';

import {getAvatarUrl, getLink} from '../models/project.js';

import {TruncatedMarkdown} from './includes/markdown.jsx';
import ProjectOptionsPop from "./pop-overs/project-options-pop.jsx";
import UsersList from "./users-list.jsx";

const getContrastTextColor = (hexcolor) => {
    var r = parseInt(hexcolor.substr(0,2),16);
    var g = parseInt(hexcolor.substr(2,2),16);
    var b = parseInt(hexcolor.substr(4,2),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? 'black' : 'white';
}

export const ProjectItem = ({api, project, collectionColor, ...props}) => {
  return (
    <li>
      <UsersList glitchTeam={project.showAsGlitchTeam} users={project.users} extraClass="single-line"/>
      <ProjectOptionsPop {...{project, api}} {...props}/>
      <a href={getLink(project.domain)}>
        <div className={['project', project.private ? 'private-project' : ''].join(' ')} 
          style={{backgroundColor: collectionColor, borderBottomColor:collectionColor}}
          data-track="project" data-track-label={project.domain}>
          <div className="project-container">
            <img className="avatar" src={getAvatarUrl(project.id)} alt={`${project.domain} avatar`}/>
            <div className="button">
              <span className="project-badge private-project-badge" aria-label="private"></span>
              <div className="project-name">{project.domain}</div>
            </div>
            <div className="description" 
              style={{color: (collectionColor ? getContrastTextColor(collectionColor) : "black" )}}><TruncatedMarkdown length={96}>{project.description}</TruncatedMarkdown></div>
            <div className="overflow-mask" style={{backgroundColor: collectionColor}}></div>
          </div>
        </div>
      </a>
    </li>
  );
};

ProjectItem.propTypes = {
  addProjectToCollection: PropTypes.func,
  api: PropTypes.func,
  currentUser: PropTypes.object,
  project: PropTypes.shape({
    description: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    private: PropTypes.bool.isRequired,
    showAsGlitchTeam: PropTypes.bool.isRequired,
    users: PropTypes.array.isRequired,
  }).isRequired,
  collectionColor: PropTypes.string,
  projectOptions: PropTypes.object,
};


export default ProjectItem;