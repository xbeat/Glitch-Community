import React from 'react';
import PropTypes from 'prop-types';

import Heading from 'Components/text/heading';
import Embed from 'Components/project/embed';

import styles from './project-embed.styl';

const ProjectEmbed = ({ project, heading, topRightButtons, leftButtons, rightButtons }) => (
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
        <div className={styles.topRightButtons}>
          {topRightButtons}
        </div>
      )
    }
    <Embed domain={project.domain} />
    {
      leftButtons && (
        <div className={styles.leftButtons}>
          {leftButtons}
        </div>
      )
    }
    {
      rightButtons && (
        <div className={styles.rightButtons}>
          {rightButtons}
        </div>
      )
    }
  </section>
);

ProjectEmbed.propTypes = {
  project: PropTypes.object.isRequired,
  heading: PropTypes.any,
  topRightButtons: PropTypes.any,
  leftButtons: PropTypes.any,
  rightButtons: PropTypes.any,
};

ProjectEmbed.defaultProps = {
  heading: null,
  topRightButtons: null,
  leftButtons: null,
  rightButtons: null,
};

export default ProjectEmbed;
