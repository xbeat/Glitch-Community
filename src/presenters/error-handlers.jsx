import React from "react";
import PropTypes from "prop-types";

<<<<<<< HEAD
import Notifications from "./notifications.jsx";
=======
import { NotificationConsumer } from './notifications';
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656

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

<<<<<<< HEAD
function handleCustomError(notify, error) {
  console.error(error);
  if (error && error.response && error.response.data) {
    notify(error.response.data.message, "notifyError");
  }
  return Promise.reject(error);
}

const ErrorHandler = ({ children }) => (
  <Notifications>
    {({ createNotification, createErrorNotification }) =>
      children({
        handleError: error => handleError(createErrorNotification, error),
        handleErrorForInput: error =>
          handleErrorForInput(createErrorNotification, error),
        handleCustomError: error =>
          handleCustomError(createNotification, error)
      })
    }
  </Notifications>
=======
const ErrorHandler = ({ children }) => (
  <NotificationConsumer>
    {({ createErrorNotification }) => children({
      handleError: error => handleError(createErrorNotification, error),
      handleErrorForInput: error => handleErrorForInput(createErrorNotification, error),
    })
    }
  </NotificationConsumer>
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
);
ErrorHandler.propTypes = {
  children: PropTypes.func.isRequired
};

export default ErrorHandler;
