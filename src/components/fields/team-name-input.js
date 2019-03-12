import React from 'react';
import PropTypes from 'prop-types';

import OptimisticTextInput from './optimistic-text-input';

const TeamNameInput = ({ name, onChange, suffix }) => (
  <OptimisticTextInput
    value={name}
    onChange={onChange}
    placeholder="What's its name?"
    suffix={suffix}
  />
);

TeamNameInput.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  suffix: PropTypes.node,
};

TeamNameInput.defaultProps = {
  suffix: null,
};

export default TeamNameInput;
