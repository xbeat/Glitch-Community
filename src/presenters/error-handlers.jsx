import React from 'react';
import PropTypes from 'prop-types';

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

const ErrorHandler = ({children, createErrorNotification}) => {
  children({
    handleError, handleErrorForInput,
    handleErrorWrap: obj => 
};