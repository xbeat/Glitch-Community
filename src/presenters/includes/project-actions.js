import React from 'react';
import PropTypes from 'prop-types';

import { getShowUrl, getEditorUrl, getRemixUrl } from '../../models/project';
import Button from '../../components/buttons/button';

const showIcon = 'https://cdn.glitch.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fshow-app.svg';

export const ShowButton = ({ name }) => (
  <Button href={getShowUrl(name)}>
    <img src={showIcon} alt="" /> Show
  </Button>
);
ShowButton.propTypes = {
  name: PropTypes.string.isRequired,
};

export const EditButton = ({ name, isMember }) => (
  <Button href={getEditorUrl(name)}>
    {isMember ? 'Edit Project' : 'View Source'}
  </Button>
);
EditButton.propTypes = {
  name: PropTypes.string.isRequired,
  isMember: PropTypes.bool,
};

EditButton.defaultProps = {
  isMember: false,
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
