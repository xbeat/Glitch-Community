import React from 'react';
import PropTypes from 'prop-types';

import Notifications from './notifications.jsx';

function handleError(notify, error) {
  console.error(error);
  notify();
  return Promise.reject(error);
}

function handleErrorForInput(notify, error) {
  if (error && error.response && error.response.data) {
    return Promise.reject(error.response.data.message);
  }
  console.error(error);
  notify();
  return Promise.reject();
}

const ErrorHandler = ({children}) => (
  <Notifications>
    {({createErrorNotification}) => children({
      handleError: error => handleError(createErrorNotification, error),
      handleErrorForInput: error => handleErrorForInput(createErrorNotification, error),
    })}
  </Notifications>
);
ErrorHandler.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ErrorHandler;