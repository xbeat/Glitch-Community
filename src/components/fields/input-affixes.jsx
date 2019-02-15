import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './input-affixes.styl';
const cx = classNames.bind(styles);

const InputErrorMessage = ({error}) => {
  return <div className={cx('error-message')}>{error}</div>;
};

InputErrorMessage.propTypes = {
  error: PropTypes.node.isRequired,
};

export default InputErrorMessage;