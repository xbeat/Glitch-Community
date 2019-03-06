import React from 'react';
import PropTypes from 'prop-types';

import { getAvatarUrl } from '../models/project';

import { ProjectLink } from './includes/link';
import { TruncatedMarkdown } from './includes/markdown';
import ProjectOptionsPop from './pop-overs/project-options-pop';
import UsersList from './users-list';

const ProjectItem = ({ api, project, ...props }) => (
  console.log("SUP I'm A PROJECT ITEM")
  
  return (
    <li>
       I'm an annotation: {project.annotation}
       UsersList
         litchTeam={project.showAsGlitchTeam}
         sers={project.users}
         xtraClass="single-line"
         eams={project.teams}
       >
       ProjectOptionsPop {...{ project, api }} {...props} />
       ProjectLink project={project} className="button-area">
         div
           lassName={['project', project.private ? 'private-project' : ''].join(' ')}
           ata-track="project"
           ata-track-label={project.domain}
         
           div className="project-container">
             img className="avatar" src={getAvatarUrl(project.id)} alt="" />
             div className="button">
               span
                 lassName="project-badge private-project-badge"
                 ria-label="private"
               >
               div className="project-name">
                 project.domain}
               /div>
             /div>
             div className="description">
               TruncatedMarkdown length={80}>
                 project.description}
               /TruncatedMarkdown>
             /div>
             div className="overflow-mask" />
           /div>
         /div>
       /ProjectLink>
     </li>
)  ;
}
ProjectItem.propTypes = {
  api: PropTypes.func,
  currentUser: PropTypes.object,
  project: PropTypes.shape({
    annotation: PropTypes.string,
    description: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    private: PropTypes.bool.isRequired,
    showAsGlitchTeam: PropTypes.bool.isRequired,
    users: PropTypes.array.isRequired,
    teams: PropTypes.array,
  }).isRequired,
  projectOptions: PropTypes.object,
};

ProjectItem.defaultProps = {
  api: null,
  currentUser: null,
  projectOptions: {},
};

export default ProjectItem;
