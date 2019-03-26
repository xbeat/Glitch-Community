import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './badge.styl';

export const TYPES = ['success', 'warning', 'error'];
const cx = classNames.bind(styles);

/**
 * Badge Component
 */
const Badge = ({ type, children }) => {
  const className = cx({
    badge: true,
    success: type === 'success',
    warning: type === 'warning',
    error: type === 'error',
  });
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
