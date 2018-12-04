import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import moment from 'moment-mini';

import Link from '../includes/link';
import LocalStorage from '../includes/local-storage';
import PopoverContainer from './popover-container';
import {DevToggles} from '../includes/dev-toggles';

/* global GITHUB_CLIENT_ID, FACEBOOK_CLIENT_ID, APP_URL */

function githubAuthLink() {
  const params = new URLSearchParams();
  params.append('client_id', GITHUB_CLIENT_ID);
  params.append('scope', 'user:email');
  params.append('redirect_uri', `${APP_URL}/login/github`);
  return `https://github.com/login/oauth/authorize?${params}`;
}

function facebookAuthLink() {
  const params = new URLSearchParams();
  params.append('client_id', FACEBOOK_CLIENT_ID);
  params.append('scope', 'email');
  params.append('redirect_uri', `${APP_URL}/login/facebook`);
  return `https://www.facebook.com/v2.9/dialog/oauth?${params}`;
}

const SignInPopButton = (props) => (
  <Link className="button button-small button-link has-emoji" to={props.href} onClick={props.onClick}>
    Sign in with {props.company} <span className={`emoji ${props.emoji}`}></span>
  </Link>
);

class EmailHandler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ''
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  
  onChange(e) {
    this.setState({email: e.target.value});
  }
  
  async onSubmit(e) {
    e.preventDefault();
    try {
      await this.props.api.post('/email/sendLoginEmail', {emailAddress:this.state.email});
      alert("Please check your email at " + this.state.email);
    } catch (error) {
      console.error(error);
      alert("Something went wrong; email not sent.");
    }
  }
  
  render() {
    return (
      <section className="pop-over-actions last-section">
        Sign in with email
        <form onSubmit={(e) => this.onSubmit(e)}>
          <input value={this.state.email} onChange={this.onChange} className="pop-over-input" type="email" placeholder="new@user.com"></input>
          <EmailSignInButton/>
        </form>
      </section>
    );
  }
}

const EmailSignInButton = () => (
  <button style={{marginTop: 10}} className="button-small button-link has-emoji" >
    Email Sign In <span aria-label="" role="img">📧</span>
  </button>
);

const SignInPopWithoutRouter = ({header, prompt, api, location, hash}) => (
  <LocalStorage name="destinationAfterAuth">
    {(destination, setDestination) => {
      const onClick = () => setDestination({
        expires: moment().add(10, 'minutes').toISOString(),
        to: {
          pathname: location.pathname,
          search: location.search,
          hash: hash,
        },
      });
      return (
        <div className="pop-over sign-in-pop">
          {header}
          <section className="pop-over-actions first-section">
            {prompt}
            <SignInPopButton href={facebookAuthLink()} company="Facebook" emoji="facebook" onClick={onClick}/>
            <SignInPopButton href={githubAuthLink()} company="GitHub" emoji="octocat" onClick={onClick}/>
          </section>
          <DevToggles>
            {(enabledToggles) => (
              enabledToggles.includes("Email Login") && <EmailHandler api={api} />
            )}
          </DevToggles>
        </div>
      );
    }}
  </LocalStorage>
);

export const SignInPop = withRouter(SignInPopWithoutRouter);
SignInPop.propTypes = {
  api: PropTypes.func.isRequired,
  header: PropTypes.node,
  prompt: PropTypes.node,
  hash: PropTypes.string,
};

export default function SignInPopContainer(props) {
  return (
    <PopoverContainer>
      {({togglePopover, visible}) => (
        <div className="button-wrap">
          <button className="button button-small" onClick={togglePopover}>Sign in</button>
          {visible && <SignInPop {...props}/>}
        </div>
      )}
    </PopoverContainer>
  );
}
