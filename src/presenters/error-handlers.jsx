import React from 'react';
import PropTypes from 'prop-types';

import { NotificationConsumer } from './notifications';

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

const ErrorHandler = ({ children }) => (
  <NotificationConsumer>
    {({ createErrorNotification }) => children({
      handleError: error => handleError(createErrorNotification, error),
      handleErrorForInput: error => handleErrorForInput(createErrorNotification, error),
    })
    }
  </NotificationConsumer>
);
ErrorHandler.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ErrorHandler;
