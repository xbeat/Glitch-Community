import React from 'react';
import PropTypes from 'prop-types';

import { getShowUrl, getEditorUrl, getRemixUrl } from 'Models/project';
import Button, { SIZES } from 'Components/buttons/button';
import Heading from 'Components/text/heading';

const showIcon = 'https://cdn.glitch.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fshow-app.svg';

export const ShowButton = ({ name, size }) => (
  <Button href={getShowUrl(name)} size={size}>
    <img src={showIcon} alt="" /> Show
    <Heading tagName="h1">heading</Heading>
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
