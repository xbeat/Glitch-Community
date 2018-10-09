import React from 'react';
import PropTypes from 'prop-types';
import Link from '../includes/link.jsx';
import PopoverContainer from './popover-container.jsx';
/* global GITHUB_CLIENT_ID, FACEBOOK_CLIENT_ID, APP_URL */

function githubAuthLink() {
  const clientId = GITHUB_CLIENT_ID;
  const scope = "user:email";
  const redirectUri = encodeURIComponent(`${APP_URL}/login/github`);
  return `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`;
}

function facebookAuthLink() {
  const clientId = FACEBOOK_CLIENT_ID;
  const scopes = "email";
  const callbackURL = encodeURIComponent(`${APP_URL}/login/facebook`);
  return `https://www.facebook.com/v2.9/dialog/oauth?client_id=${clientId}&scope=${scopes}&redirect_uri=${callbackURL}`;
}

const SignInPopButton = (props) => (
  <Link className="button button-small button-link" to={props.href}>
    Sign in with {props.company} <span className={`emoji ${props.emoji}`}></span>
  </Link>
);

export const SignInPop = ({prompt}) => (
  <div className="pop-over sign-in-pop">
    {!!prompt && <section className="pop-over-info">{prompt}</section>}
    <section className="pop-over-actions last-section">
      <SignInPopButton href={facebookAuthLink()} company="Facebook" emoji="facebook"/>
      <SignInPopButton href={githubAuthLink()} company="GitHub" emoji="octocat"/>
    </section>
  </div>
);
SignInPop.propTypes = {
  prompt: PropTypes.string,
};

export default function SignInPopContainer() {
  return (
    <PopoverContainer>
      {({togglePopover, visible}) => (
        <div className="button-wrap">
          <button className="button button-small" onClick={togglePopover}>Sign in</button>
          {visible && <SignInPop/>}
        </div>
      )}
    </PopoverContainer>
  );
}
