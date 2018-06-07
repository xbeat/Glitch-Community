import React from 'react';
import PropTypes from 'prop-types';
import {uniqueId} from 'lodash';

const PrefixedInput = ({prefix, ...props}) => {
  if(!prefix) {
    return <input {...props}/>;
  }
  
  const inputId = props.id || uniqueId('prefixed-input-');
  return (
    <label htmlFor={inputId} className="content-editable-prefix-label">
      <span className="content-editable-prefix">{prefix}</span>
      <input id={inputId} {...props}/>
    </label>
  );
};
PrefixedInput.propTypes = {
  prefix: PropTypes.string,
};

export default PrefixedInput;