import React from 'react';
import PropTypes from 'prop-types';

import OptimisticTextInput from './optimistic-text-input';

import { VerifiedBadge } from '../../presenters/includes/team-elements';

const TeamNameInput = ({ name, onChange, verified }) => (
  <OptimisticTextInput
    value={name}
    onChange={onChange}
    placeholder="What's its name?"
    postfix={verified ? <VerifiedBadge /> : null}
  />
);

TeamNameInput.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  verified: PropTypes.bool,
};

TeamNameInput.defaultProps = {
  verified: false,
};

export default TeamNameInput;
