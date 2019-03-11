import React from 'react';
import PropTypes from 'prop-types';

import { getAvatarUrl } from '../models/project';

import { ProjectLink } from './includes/link';
import { TruncatedMarkdown } from './includes/markdown';
import ProjectOptionsPop from './pop-overs/project-options-pop';
import UsersList from './users-list';
// import Annotation from './annotation';
import Annotation from '../components/fields/note';

const ProjectItem = ({
  api, project, currentUser, ...props
}) => (
  <li>
    <Annotation
      currentUser={currentUser}
      project={project}
      update={note => props.projectOptions.updateOrAddNote({ annotation: note, projectId: project.id })}
    />
    <UsersList
      glitchTeam={project.showAsGlitchTeam}
      users={project.users}
      extraClass="single-line"
      teams={project.teams}
    />
    <ProjectOptionsPop {...{ project, api }} {...props} />
    <ProjectLink project={project} className="button-area">
      <div
        className={['project', project.private ? 'private-project' : ''].join(' ')}
        data-track="project"
        data-track-label={project.domain}
      >
        <div className="project-container">
          <img className="avatar" src={getAvatarUrl(project.id)} alt="" />
          <div className="button">
            <span
              className="project-badge private-project-badge"
              aria-label="private"
            />
            <div className="project-name">
              {project.domain}
            </div>
          </div>
          <div className="description">
            <TruncatedMarkdown length={80}>
              {project.description}
            </TruncatedMarkdown>
          </div>
          <div className="overflow-mask" />
        </div>
      </div>
    </ProjectLink>
  </li>
);

ProjectItem.propTypes = {
  api: PropTypes.func,
  currentUser: PropTypes.object,
  project: PropTypes.shape({
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
