import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Markdown from 'Components/text/markdown';
import { ProjectLink } from '../../presenters/includes/link';
import ProjectAvatar from '../../presenters/includes/project-avatar';
import ProjectOptionsPop from '../../presenters/pop-overs/project-options-pop';
import UsersList from '../../presenters/includes/users-list';
import styles from './project-item.styl';

// TODO: componentize, share with small-collection-item
const FakeButton = ({ children }) => <div className="button">{children}</div>;
const PrivateIcon = () => <span className="project-badge private-project-badge" aria-label="private" />;

const ProjectItem = ({ project,  hideProjectDescriptions, ...props }) => (
  <div className={styles.container}>
    <div className={styles.userListContainer}>
      <UsersList extraClass="single-line" glitchTeam={project.showAsGlitchTeam} users={project.users} teams={project.teams} />
    </div>    
    <ProjectOptionsPop project={project} {...props} />
    <ProjectLink className={classnames(styles.projectBody, {
        [styles.private]: project.private,
        [styles.hideDescription]: hideProjctDescriptions,
      })}>
      <div className={styles.projectHeader}>
        <div className={styles.avatarWrap}>
          <ProjectAvatar id={project.id} />
        </div>
        <div className={styles.nameWrap}>
        <FakeButton>
          {project.private && <PrivateIcon />}
          <div className={styles.projectDomain}>{project.domain}</div>
        </FakeButton>
        </div>
      </div>

      
      <img className="avatar" src={getAvatarUrl(project.id)} alt="" />
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
    </ProjectLink>
  </div>
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