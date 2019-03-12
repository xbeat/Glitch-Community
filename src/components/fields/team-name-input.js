import React from 'react';
import PropTypes from 'prop-types';

import OptimisticTextInput from './optimistic-text-input';

const TeamNameInput = ({ name, onChange, postfix }) => (
  <OptimisticTextInput
    value={name}
    onChange={onChange}
    placeholder="What's its name?"
    postfix={postfix}
  />
);

TeamNameInput.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  postfix: PropTypes.node,
};

TeamNameInput.defaultProps = {
  postfix: null,
};

export default TeamNameInput;
