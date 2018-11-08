import React from 'react';
import PropTypes from 'prop-types';
import Link from '../includes/link';
import PopoverContainer from './popover-container';
import {DevToggles} from '../includes/dev-toggles';
/* global GITHUB_CLIENT_ID, FACEBOOK_CLIENT_ID, APP_URL */

function githubAuthLink(data) {
  const params = new URLSearchParams();
  params.append('client_id', GITHUB_CLIENT_ID);
  params.append('scope', 'user:email');
  params.append('redirect_uri', `${APP_URL}/login/github?${data || ''}`);
  return `https://github.com/login/oauth/authorize?${params}`;
}

function facebookAuthLink(data) {
  const params = new URLSearchParams();
  params.append('client_id', FACEBOOK_CLIENT_ID);
  params.append('scope', 'email');
  params.append('redirect_uri', `${APP_URL}/login/facebook?${data || ''}`);
  return `https://www.facebook.com/v2.9/dialog/oauth?${params}`;
}

const SignInPopButton = (props) => (
  <Link className="button button-small button-link has-emoji" to={props.href}>
    Sign in with {props.company} <span className={`emoji ${props.emoji}`}></span>
  </Link>
);

const jankyEmailPrompt = () => {
  const email = window.prompt("[testing dialog]\n\nWhat's your email address?");
  
}

const EmailSignInButton = () => {
  <DevToggles>
    {(enabledToggles) => (
      enabledToggles.includes("Email Login") && <EmailSignInButton/>
    )}
  </DevToggles>
  <button onClick={jankyEmailPrompt} >Sign in with Email 📧</button>
}

export const SignInPop = ({header, prompt, params}) => (
  <div className="pop-over sign-in-pop">
    {header}
    <section className="pop-over-actions last-section">
      {prompt}
      <SignInPopButton href={facebookAuthLink(params)} company="Facebook" emoji="facebook"/>
      <SignInPopButton href={githubAuthLink(params)} company="GitHub" emoji="octocat"/>
      <EmailSignInButton/>
    </section>
  </div>
);
SignInPop.propTypes = {
  header: PropTypes.node,
  prompt: PropTypes.node,
  params: PropTypes.string,
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
