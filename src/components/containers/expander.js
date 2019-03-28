import React from 'react';
import PropTypes from 'prop-types';
import styles from './expander.styl';

const ExpanderContainer = ({ expanded, controlArea, children }) => (
  <div className={styles.container}>
    {children}
    {expanded ? null : <div className={styles.controlArea}>{controlArea}</div>}
  </div>
);

ExpanderContainer.propTypes = {
  expanded: PropTypes.bool.isRequired,
  controlArea: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
};

export default ExpanderContainer;
