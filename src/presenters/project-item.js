import React from 'react';
import PropTypes from 'prop-types';

import { getAvatarUrl } from '../models/project';

import { ProjectLink } from './includes/link';
import { TruncatedMarkdown } from './includes/markdown';
import ProjectOptionsPop from './pop-overs/project-options-pop';
import UsersList from './users-list';
import Note from '../components/fields/note';

const ProjectItem = ({
  api, project, currentUser, ...props
}) => (
  <li>
    <Note
      currentUser={currentUser}
      project={project}
      update={note => props.projectOptions.updateOrAddNote({ note, projectId: project.id })}
    />
    <Note currentUser={{ 
        avatarThumbnailUrl: "https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/3864a79d-937d-4f61-83e6-fec22f484269-small.png"
          avatarUrl: "https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/3864a79d-937d-4f61-83e6-fec22f484269-large.png"
color: "#9cf989"

facebookId: null
facebookToken: null
featuredProjectId: null
features: []
gitAccessToken: "62cc115a-de7f-4444-a6e1-49e856721fe7"
githubId: 6620164
githubToken: "f44cb020335657f56deaf00bf507abb0951b303e"
hasCoverImage: false
id: 433767
lastActiveDay: "2019-03-11"
location: "Brooklyn, NY"
login: "sarahzinger"
name: "Sarah Zinger"
persistentToken: "319d4e97-f385-4fc3-8607-0934251477d5"
pins: [{…}]
projects: (39) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
teams: (2) [{…}, {…}]
thanksCount: 0
updatedAt: "2019-03-11T13:58:14.577Z"
utcOffset: -240 }} update={something => console.log(something)} project={{ isAddingANewNote: true }} />

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
