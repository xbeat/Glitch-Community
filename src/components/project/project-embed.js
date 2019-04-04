import React from 'react';
import PropTypes from 'prop-types';

import Heading from 'Components/text/heading';
import Embed from 'Components/project/embed';

import styles from './project-embed.styl';

const ProjectEmbed = ({ project, topLeft, topRight, bottomLeft, bottomRight }) => (
  <section className={styles.projectEmbed}>
    <div className={styles.buttonContainer}>
      <div className={styles.containerChild>{topLeft}</div>
      <div className={styles.containerChild>{topLeft}</div>
    </div>
    <Embed domain={project.domain} />
    { 
      (leftButtons || rightButtons) && (
        <div className={styles.buttonContainer}>
          {
            leftButtons && (
              <div className={styles.containerChild}>
                {leftButtons}
              </div>
            )
          }
          {
            rightButtons && (
              <div className={styles.containerChild}>
                {rightButtons}
              </div>
            )
          }
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
