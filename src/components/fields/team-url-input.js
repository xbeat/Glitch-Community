import React from 'react';
import PropTypes from 'prop-types';

import OptimisticTextInput from './optimistic-text-input';

const TeamUrlInput = ({ url, onChange }) => (
  <OptimisticTextInput
    prefix="@"
    value={url}
    onChange={onChange}
    placeholder="Short url?"
  />
);

TeamUrlInput.propTypes = {
};

export default TeamUrlInput;