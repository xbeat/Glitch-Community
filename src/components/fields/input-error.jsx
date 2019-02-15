import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './input-wrap.styl';

const cx = classNames.bind(styles);

const InputError = ({children, className, error}) => {
  return (
    <div className={cx('error-wrap', className)}>
      {children}
      {!!error && <div className={cx('error')}>{error}</div>}
    </div>
  );
};

InputError.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  error: PropTypes.node,
};

export default InputError;