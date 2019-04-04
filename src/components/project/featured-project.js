import React from 'react';
import PropTypes from 'prop-types';

import Heading from 'Components/text/heading';
import ProjectEmbed from 'Components/project/project-embed';
import Emoji from 'Components/images/emoji';
import FeaturedProjectOptionsPop from '../../presenters/pop-overs/featured-project-options-pop';
import ReportButton from '../../presenters/pop-overs/report-abuse-pop';
import { EditButton, RemixButton } from '../../presenters/includes/project-actions';
import AddProjectToCollection from '../../presenters/includes/add-project-to-collection';
import { TrackClick } from '../../presenters/analytics';

import styles from './project-embed.styl';

const ProjectEmbed = ({ isAuthorized, currentUser, unfeatureProject, addProjectToCollection, featuredProject }) => (
  <section className={styles.projectEmbed}>
    <Heading tagName="h2">
      Featured Project
      <Emoji name="clapper" isInTitle />
    </Heading>
    {isAuthorized && <FeaturedProjectOptionsPop unfeatureProject={unfeatureProject} />}
    <Embed domain={featuredProject.domain} />
    <div className={styles.leftButtons}>
      {
        isAuthorized ? (
          <EditButton name={featuredProject.id} isMember={isAuthorized} size="small" />
        ) : (
          <ReportButton reportedType="project" reportedModel={featuredProject} />
        )
      }
    </div>
    <div className={styles.rightButtons}>
      {currentUser.login && (
        <AddProjectToCollection
          currentUser={currentUser}
          project={featuredProject}
          fromProject
          addProjectToCollection={addProjectToCollection}
        />
      )}
      <TrackClick
        name="Click Remix"
        properties={{
          baseProjectId: featuredProject.id,
          baseDomain: featuredProject.domain,
        }}
      >
        <RemixButton name={featuredProject.domain} isMember={isAuthorized} />
      </TrackClick>
    </div>
  </section>
);

ProjectEmbed.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
  unfeatureProject: PropTypes.func.isRequired,
  featuredProject: PropTypes.object.isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
};

ProjectEmbed.defaultProps = {
  currentUser: {},
};

export default ProjectEmbed;
