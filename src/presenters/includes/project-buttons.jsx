/* global EDITOR_URL */

import React from 'react';
import PropTypes from 'prop-types';

const showIcon = "https://cdn.gomix.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fshow-app.svg";

const showUrl = (name) => `https://${name}.glitch.me`;
const editUrl = (name) => `${EDITOR_URL}#!/${name}`;
const remixUrl = (name) => `${EDITOR_URL}#!/remix/${name}`;

const ButtonLink = ({href, children, className, onClick}) => (
  <a
    href={href} target="_blank"
    className={`button button-link ${className}`}
    onClick={onClick}
  >
    {children}
  </a>
);
ButtonLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export const ShowButton = ({name, ...props}) => (
  <ButtonLink href={showUrl(name)} {...props}>
    <img src={showIcon} alt=""/>
    {' '}Show
  </ButtonLink>
);
ShowButton.propTypes = {
  name: PropTypes.string.isRequired,
};

export const EditButton = ({name, isMember, ...props}) => (
  <ButtonLink href={editUrl(name)} {...props}>
    {isMember ? 'Edit Project' : 'View Source'}
  </ButtonLink>
);
EditButton.propTypes = {
  name: PropTypes.string.isRequired,
  isMember: PropTypes.bool,
  className: PropTypes.string,
};

export const RemixButton = ({name, isMember, ...props}) => (
  <ButtonLink href={remixUrl(name)} {...props}>
    {isMember ? 'Remix This' : 'Remix your own'}{' '}
    <span className="emoji microphone" role="presentation"></span>
  </ButtonLink>
);
RemixButton.propTypes = {
  name: PropTypes.string.isRequired,
  isMember: PropTypes.bool,
};

export const FeedbackButton = ({name, id, ...props}) => {
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
  return <ButtonLink href={mailto} {...props}>What do you think?</ButtonLink>;
};
FeedbackButton.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
