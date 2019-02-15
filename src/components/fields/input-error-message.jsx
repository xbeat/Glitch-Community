import React from 'react';
import PropTypes from 'prop-types';

import styles from './input-error-message.styl';

const InputErrorMessage = ({error}) => {
  return <div className={styles.errorMessage}>{error}</div>;
};

InputErrorMessage.propTypes = {
  error: PropTypes.node.isRequired,
};

export default InputErrorMessage;