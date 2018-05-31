/* global EDITOR_URL */

import React from 'react';
import PropTypes from 'prop-types';

const showIcon = "https://cdn.gomix.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fshow-app.svg";

const previewUrl = (name) => `https://${name}.glitch.me`;
const editUrl = (name) => `${EDITOR_URL}#!/${name}`;
const remixUrl = (name) => `${EDITOR_URL}#!/remix/${name}`;

export const PreviewButton = ({name, className}) => (
  <a className={`button button-link ${className}`} href={previewUrl(name)}>
    <img src={showIcon} alt=""/>
    {' '}Preview
  </a>
);
PreviewButton.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export const EditButton = ({name, isMember, className}) => (
  <a className={`button button-link ${className}`} href={editUrl(name)}>
    {isMember ? 'Edit Project' : 'View Source'}
  </a>
);
EditButton.propTypes = {
  name: PropTypes.string.isRequired,
  isMember: PropTypes.bool,
  className: PropTypes.string,
};

export const RemixButton = ({name, isMember, className, onClick}) => (
  <a className={`button button-link ${className}`} href={remixUrl(name)} onClick={onClick}>
    {isMember ? 'Remix This' : 'Remix your own'}{' '}
    <span className="emoji microphone" role="presentation"></span>
  </a>
);
RemixButton.propTypes = {
  name: PropTypes.string.isRequired,
  isMember: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export const FeedbackButton = ({name, id}) => {
  const support = "customer-service@fogcreek.com";
  const subject = `[Glitch] I have feelings about ${name}`;
  const body = `\
What do you think of the ${name} project? 
Is it great? Should we feature it? Is it malicious?

Let us know:





--------------------

Thanks 💖

– Glitch Team

(project id: ${id})\
`;
  const mailto = encodeURI(`mailto:${support}?subject=${subject}&body=${body}`);
  return <a className="button button-link button-small" href={mailto}>What do you think?</a>;
};
FeedbackButton.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
