import PropTypes from 'prop-types';

import { useNotifications } from './notifications';

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

export const useErrorHandlers = () => {
  const { createErrorNotification } = useNotifications();
  return {
    handleError: error => handleError(createErrorNotification, error),
    handleErrorForInput: error => handleErrorForInput(createErrorNotification, error),
  };
};

export const ErrorHandler = ({ children }) => {
  const errorHandlers = useErrorHandlers();
  return children(errorHandlers);
};
ErrorHandler.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ErrorHandler;
