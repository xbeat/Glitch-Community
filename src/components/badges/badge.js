import React from 'react';
import PropTypes from 'prop-types';
import styles from './badge.styl';

export const TYPES = ['success', 'warning', 'error'];

/**
 * Badge Component
 */
const Badge = ({ type, children }) => {
  const className = styles.badge + (type ? styles.type : '');
  return <div className={className}>{children}</div>;
};

Badge.propTypes = {
  /** element(s) to display in the tag */
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(TYPES),
};

Badge.defaultProps = {
  type: null,
};

export default Badge;
