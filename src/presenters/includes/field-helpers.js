import React from 'react';
import PropTypes from 'prop-types';
import InputErrorIcon from 'Components/inputs/input-error-icon';
import { debounce } from 'lodash';

export const FieldErrorMessage = ({ error, hideIcon }) => (
  <span className="editable-field-error-message">
    {!hideIcon && (
      <span className="editable-field-error-icon">
        <InputErrorIcon />
      </span>
    )}
    {error}
  </span>
);
FieldErrorMessage.propTypes = {
  error: PropTypes.node.isRequired,
  hideIcon: PropTypes.bool,
};
FieldErrorMessage.defaultProps = {
  hideIcon: false,
};
