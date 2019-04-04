import React from 'react';
import PropTypes from 'prop-types';

import Embed from 'Components/project/embed';

import ReportButton from '../../presenters/pop-overs/report-abuse-pop';
import { EditButton, RemixButton } from '../../presenters/includes/project-actions';
import AddProjectToCollection from '../../presenters/includes/add-project-to-collection';
import { TrackClick } from '../../presenters/analytics';

import styles from './project-embed.styl';

const ProjectEmbed = ({ project, topLeft, topRight, isAuthorized, currentUser, addProjectToCollection, trackingOrigin }) => {
  const BottomLeft = () => {
    if (isAuthorized) {
      return <EditButton name={project.id} isMember={isAuthorized} size="small" />;
    }
    return <ReportButton reportedType="project" reportedModel={project} />;
  };

  const BottomRight = () => (
    <>
      {
        currentUser.login && (
          <AddProjectToCollection
            project={project}
            currentUser={currentUser}
            addProjectToCollection={addProjectToCollection}
            fromProject
          />
        )
      }
      <TrackClick
        name="Click Remix"
        properties={{
          baseProjectId: project.id,
          baseDomain: project.domain,
        }}
      >
        <RemixButton name={project.domain} isMember={isAuthorized} />
      </TrackClick>
    </>
  );

  return (
    <section className={styles.projectEmbed}>
      <div className={styles.buttonContainer}>
        <div className={styles.left}>{topLeft}</div>
        <div className={styles.right}>{topRight}</div>
      </div>
      <Embed domain={project.domain} />
      <div className={styles.buttonContainer}>
        <div className={styles.left}>
          <BottomLeft />
        </div>
        <div className={styles.right}>
          <BottomRight />
        </div>
      </div>
    </section>
  );
};

ProjectEmbed.propTypes = {
  project: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  addProjectToCollection: PropTypes.func,
  topLeft: PropTypes.any,
  topRight: PropTypes.any,
};

ProjectEmbed.defaultProps = {
  addProjectToCollection: null,
  topLeft: null,
  topRight: null,
};

export default ProjectEmbed;
