import React from 'react';
import PropTypes from 'prop-types';

import { getShowUrl, getEditorUrl, getRemixUrl } from '../../models/project';
import Button, { SIZES } from '../../components/buttons/button';
import Emoji from '../../components/images/emoji';

export const ShowButton = ({ name, size }) => (
  <Button href={getShowUrl(name)} size={size}>
    <Emoji name="sunglasses" /> Show
  </Button>
);
ShowButton.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.oneOf(SIZES),
};

ShowButton.defaultProps = {
  size: null,
};

export const EditButton = ({ name, isMember, size }) => (
  <Button href={getEditorUrl(name)} size={size}>
    {isMember ? 'Edit Project' : 'View Source'}
  </Button>
);
EditButton.propTypes = {
  name: PropTypes.string.isRequired,
  isMember: PropTypes.bool,
  size: PropTypes.oneOf(SIZES),
};

EditButton.defaultProps = {
  isMember: false,
  size: null,
};

export const RemixButton = ({ name, isMember }) => (
  <Button href={getRemixUrl(name)} size="small">
    {isMember ? 'Remix This' : 'Remix your own'} <span className="emoji microphone" role="presentation" />
  </Button>
);
RemixButton.propTypes = {
  name: PropTypes.string.isRequired,
  isMember: PropTypes.bool,
};

RemixButton.defaultProps = {
  isMember: false,
};
