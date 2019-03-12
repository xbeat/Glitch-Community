import React from 'react';
import PropTypes from 'prop-types';

import TextInput from './text-input';
import useOptimisticText from './use-optimistic-text';

const OptimisticTextInput = ({ value, onChange, ...props }) => {
  const [optimisticValue, optimisticError, optimisticOnChange] = useOptimisticText(value, onChange);
  return <TextInput {...props} value={optimisticValue} error={
};

OptimisticTextInput.propTypes = {
  text: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default OptimisticTextInput;