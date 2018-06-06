import React from 'react';
import PropTypes from 'prop-types';
import {uniqueId} from 'lodash';

const PrefixedInput = ({prefix, ...props}) => {
  if(!prefix) {
    return <input {...props}/>;
  }
  
  const className = props.className || "";
  const inputId = props.id || uniqueId('prefixed-input-');
  return (
    <div style={{display: 'flex'}}>
      <label htmlFor={inputId} style={{width: 'auto'}} className={className}>{prefix}</label>
      <input id={inputId} {...props}/>
    </div>
  );
};
PrefixedInput.propTypes = {
  prefix: PropTypes.string,
};

export default PrefixedInput;