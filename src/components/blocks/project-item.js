import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Markdown from 'Components/text/markdown';
import { ProjectLink } from '../../presenters/includes/link';
import ProjectAvatar from '../../presenters/includes/project-avatar';
import ProjectOptionsPop from '../../presenters/pop-overs/project-options-pop';
import UsersList from '../../presenters/users-list';
import styles from './project-item.styl';

// TODO: componentize, share with small-collection-item
const FakeButton = ({ children }) => <div className="button">{children}</div>;
const PrivateIcon = () => <span className="project-badge private-project-badge" aria-label="private" />;

const getLinkBodyStyles = (project) =>
  classnames(styles.linkBody, {
    [styles.private]: project.private,
  });

const ProjectItem = ({ project, projectOptions, hideProjectDescriptions }) => (
  <div className={styles.container}>
    <div className={styles.userListContainer}>
      <div className={styles.userListWrap}>
        <UsersList extraClass="single-line" glitchTeam={project.showAsGlitchTeam} users={project.users} teams={project.teams} />
      </div>
    </div>
    <ProjectOptionsPop project={project} projectOptions={projectOptions} />
    <ProjectLink className={getLinkBodyStyles(project)} project={project}>
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
      <div className={styles.description}>{!hideProjectDescriptions && <Markdown>{project.description || ' '}</Markdown>}</div>
    </ProjectLink>
  </div>
);

ProjectItem.propTypes = {
  project: PropTypes.shape({
    description: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    private: PropTypes.bool,
    showAsGlitchTeam: PropTypes.bool.isRequired,
    users: PropTypes.array.isRequired,
    teams: PropTypes.array,
  }).isRequired,
  hideProjectDescriptions: PropTypes.bool,
  projectOptions: PropTypes.object,
};

ProjectItem.defaultProps = {
  hideProjectDescriptions: false,
  projectOptions: {},
};

export default ProjectItem;
