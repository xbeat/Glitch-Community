import React from 'react';
import PropTypes from 'prop-types';

const PrefixedInput = ({prefix, inputId, children}) => {
  if(!prefix) {
    return children;
  }

  return (
    <label htmlFor={inputId} className="content-editable-prefix-container">
      <span className="content-editable-prefix">{prefix}</span>
      {children}
    </label>
  );
};
PrefixedInput.propTypes = {
  prefix: PropTypes.string,
  inputId: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
};

export default PrefixedInput;