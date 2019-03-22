import React from 'react';
import PropTypes from 'prop-types';
import styles from './badge.styl';

export const TYPES = ['success', 'warning', 'error'];

/**
 * Badge Component
 */
const Badge = ({ type, children }) => {
  <div className={[styles.badge, type]}>{children}</div>
};

Badge.propTypes = {
  /** element(s) to display in the tag */
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(TYPES),
};

Badge.defaultProps = {
  type: null,
}

export default Badge;