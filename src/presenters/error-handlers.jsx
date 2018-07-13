import React from 'react';
import PropTypes from 'prop-types';

import {mapValues} from 'lodash';

import Notifications from './notifications.jsx';

function handleError(notify, error) {
  console.error(error);
  notify();
  return Promise.reject(error);
}

function handleErrorForInput(notify, error) {
  console.log('handle', error);
  if (error && error.response && error.response.data) {
    return Promise.reject(error.response.data.message);
  }
  console.error(error);
  notify();
  return Promise.reject(null);
}

function addCatch(func, handler) {
  return (...args) => func(...args).catch(handler);
}

function addCatchToAll(obj, handler) {
  console.log(obj);
  return mapValues(obj, func => addCatch(func, handler));
}

const ErrorHandler = ({children, createErrorNotification}) => {
  const handleErrorBound = handleError.bind(null, createErrorNotification);
  const handleErrorForInputBound = handleErrorForInput.bind(null, createErrorNotification);
  return children({
    handleError: error => handleErrorBound(error),
    handleErrorForInput: error => handleErrorForInputBound(error),
    addHandleError: obj => addCatchToAll(obj, handleErrorBound),
    addHandleErrorForInput: obj => addCatchToAll(obj, handleErrorForInputBound),
  });
};
ErrorHandler.propTypes = {
  children: PropTypes.func.isRequired,
  createErrorNotification: PropTypes.func.isRequired,
};

const ErrorHandlerContainer = ({children}) => (
  <Notifications>
    {notify => (
      <ErrorHandler {...notify}>
        {children}
      </ErrorHandler>
    )}
  </Notifications>
);
ErrorHandlerContainer.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ErrorHandlerContainer;