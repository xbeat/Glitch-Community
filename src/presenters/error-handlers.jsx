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

const useErrorHandlers = () => {
  const { createErrorNotification } = useNotifications();
  return {
    handleError: error => handleError(createErrorNotification, error),
    handleErrorForInput: error => handleErrorForInput(createErrorNotification, error),
  };
};

export default useErrorHandlers;
