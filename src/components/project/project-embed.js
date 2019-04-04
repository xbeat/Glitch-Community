import React from 'react';
import PropTypes from 'prop-types';

import Heading from 'Components/text/heading';
import Embed from 'Components/project/embed';
import Emoji from 'Components/images/emoji';

import FeaturedProjectOptionsPop from '../../presenters/pop-overs/featured-project-options-pop';
import ReportButton from '../../presenters/pop-overs/report-abuse-pop';
import { EditButton, RemixButton } from '../../presenters/includes/project-actions';
import AddProjectToCollection from '../../presenters/includes/add-project-to-collection';
import { TrackClick } from '../../presenters/analytics';

import styles from './project-embed.styl';

const ProjectEmbed = ({ project, heading, topRightButtons, }) => (
  <section className={styles.projectEmbed}>
    {
      heading && (
        <Heading tagName="h2">
          {heading}
        </Heading>
      )
    }
    {
      topRightButtons && (
        <div>{topRightButtons}</div>
      )
    }
    <Embed domain={project.domain} />
    {leftButtons && <div className={styles.leftButtons}>
      {leftButtons}
    </div>
    <div className={styles.rightButtons}>
      {rightButtons}
    </div>
  </section>
);

ProjectEmbed.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
  unfeatureProject: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
};

ProjectEmbed.defaultProps = {
  currentUser: {},
};

export default ProjectEmbed;
