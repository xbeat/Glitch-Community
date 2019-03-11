import React from 'react';
import PropTypes from 'prop-types';

import styles from './input-error-message.styl';

const InputErrorMessage = ({ children }) => <div className={styles.errorMessage}>{children}</div>;

InputErrorMessage.propTypes = {
  children: PropTypes.node.isRequired,
};

export default InputErrorMessage;
