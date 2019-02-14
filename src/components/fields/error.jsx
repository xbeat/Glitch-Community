import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './error.styl';

const cx = classNames.bind(styles);

const Error = ({children, error}) => {
  return (
    <div className={cx('wrap')}>
      {children}
      {!!error && <div className={cx('error')}>{error}</div>}
    </div>
  );
};

Error.propTypes = {
  children: PropTypes.node.isRequired,
  error: PropTypes.node,
};

export default Error;