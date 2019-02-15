import React from 'react';
import PropTypes from 'prop-types';

const InputErrorIcon = ({className}) => {
  return <span className={className} role="img" aria-label="Warning">🚒</span>;
};

InputErrorIcon.propTypes = {
  className: PropTypes.string,
};

export default InputErrorIcon;