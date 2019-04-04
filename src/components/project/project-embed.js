import React from 'react';
import PropTypes from 'prop-types';

import Embed from 'Components/project/embed';

import styles from './project-embed.styl';

const ProjectEmbed = ({ project, topLeft, topRight, bottomLeft, bottomRight }) => (
  <section className={styles.projectEmbed}>
    <div className={styles.buttonContainer}>
      <div className={styles.left}>{topLeft}</div>
      <div className={styles.right}>{topRight}</div>
    </div>
    <Embed domain={project.domain} />
    <div className={styles.buttonContainer}>
      <div className={styles.left}>{bottomLeft}</div>
      <div className={styles.right}>{bottomRight}</div>
    </div>
  </section>
);

ProjectEmbed.propTypes = {
  project: PropTypes.object.isRequired,
  topLeft: PropTypes.any,
  topRight: PropTypes.any,
  bottomLeft: PropTypes.any,
  bottomRight: PropTypes.any,
};

ProjectEmbed.defaultProps = {
  topLeft: null,
  topRight: null,
  bottomLeft: null,
  bottomRight: null,
};

export default ProjectEmbed;
