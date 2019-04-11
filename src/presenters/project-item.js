import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Markdown from 'Components/text/markdown';
import Image from 'Components/images/image';
import ProfileList from 'Components/profile/profile-list';
import { getAvatarUrl, getLink } from '../models/project';
import { ProjectLink } from './includes/link';
import ProjectOptionsPop from './pop-overs/project-options-pop';
import Note from './note';
import WrappingLink from './includes/wrapping-link';

const hasOptions = (projectOptions) => Object.keys(projectOptions).length > 0;

const ProjectItem = ({ project, collection, hideProjectDescriptions, ...props }) => (
  <>
    <Note
      collection={collection}
      project={project}
      update={props.projectOptions.updateOrAddNote ? (note) => props.projectOptions.updateOrAddNote({ note, projectId: project.id }) : null}
      hideNote={props.hideNote}
    />
    <div className={`project-profile-list-wrap ${hasOptions(props.propjectOptions) ? 'project--has-options' : ''}`}>
      <ProfileList layout="row" glitchTeam={project.showAsGlitchTeam} users={project.users} teams={project.teams} />
    </div>
    <ProjectOptionsPop project={project} {...props} />
    <WrappingLink href={getLink(project)} className="button-area">
      <div
        className={classnames('project', { 'private-project': project.private, 'hide-description': hideProjectDescriptions })}
        data-track="project"
        data-track-label={project.domain}
      >
        <div className="project-container">
          <Image className="avatar" src={getAvatarUrl(project.id)} alt="" />
          <ProjectLink project={project} className="button">
            <span className="project-badge private-project-badge" aria-label="private" />
            <div className="project-name">{project.domain}</div>
          </ProjectLink>
          {!hideProjectDescriptions && (
            <div className="description">
              <Markdown length={80}>{project.description}</Markdown>
            </div>
          )}
          <div className="overflow-mask" />
        </div>
      </div>
    </WrappingLink>
  </>
);

ProjectItem.propTypes = {
  author: PropTypes.object,
  hideNote: PropTypes.func,
  hideProjectDescriptions: PropTypes.bool,
  project: PropTypes.shape({
    collectionCoverColor: PropTypes.string,
    description: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    private: PropTypes.bool,
    showAsGlitchTeam: PropTypes.bool.isRequired,
    users: PropTypes.array.isRequired,
    teams: PropTypes.array,
  }).isRequired,
  projectOptions: PropTypes.object,
};

ProjectItem.defaultProps = {
  author: null,
  hideNote: () => {},
  hideProjectDescriptions: false,
  projectOptions: {},
};

export default ProjectItem;
