/* global EDITOR_URL */

import React from 'react';
import PropTypes from 'prop-types';

const showIcon = "https://cdn.gomix.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fshow-app.svg";

const showUrl = (name) => `https://${name}.glitch.me`;
const editUrl = (name) => `${EDITOR_URL}#!/${name}`;
const remixUrl = (name) => `${EDITOR_URL}#!/remix/${name}`;

const ButtonLink = ({href, children, className, onClick}) => (
  <a
    href={href} onClick={onClick}
    className={`button button-link ${className}`}
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

export const ShowButton = ({name, className, ...props}) => (
  <ButtonLink href={showUrl(name)} className={`has-emoji ${className}`} {...props}>
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

export const RemixButton = ({name, isMember, className, ...props}) => (
  <ButtonLink href={remixUrl(name)} className={`has-emoji ${className}`} {...props}>
    {isMember ? 'Remix This' : 'Remix your own'}{' '}
    <span className="emoji microphone" role="presentation"></span>
  </ButtonLink>
);
RemixButton.propTypes = {
  name: PropTypes.string.isRequired,
  isMember: PropTypes.bool,
};

export const ReportButton = ({name, id, ...props}) => {
  const support = "customer-service@fogcreek.com";
  const subject = `[Glitch] I want to report ${name}`;
  const body = `\
What do you think of the ${name} project? 
How is it malicious?

Let us know:





--------------------

Thanks 💖

– Glitch Team

(project id: ${id})\
`;
  const mailto = encodeURI(`mailto:${support}?subject=${subject}&body=${body}`);
  return <ButtonLink href={mailto} {...props}>Report Abuse</ButtonLink>;
};
ReportButton.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
