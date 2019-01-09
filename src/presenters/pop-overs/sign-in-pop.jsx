import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import dayjs from 'dayjs';

import Link from '../includes/link';
import LocalStorage from '../includes/local-storage';
import PopoverWithButton from './popover-with-button';
import {captureException} from '../../utils/sentry';
import {NestedPopover, NestedPopoverTitle} from './popover-nested.jsx';

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
      email: '',
      done: false,
      error: false
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    
  }
  
  onChange(e) {
    this.setState({email: e.target.value});

  }
  
  async onSubmit(e) {
    e.preventDefault();
    this.setState({done: true});
    try {
      await this.props.api.post('/email/sendLoginEmail', {emailAddress:this.state.email});
      this.setState({error: false});
    } catch (error) {
      captureException(error);
      this.setState({error: true});
    }
  }
   
  render() {
    const isEnabled = this.state.email.length > 0;
    return (
      <dialog className="pop-over sign-in-pop">
        <NestedPopoverTitle>
          Email Sign In <span className="emoji email" />
        </NestedPopoverTitle>
        <section className="pop-over-actions first-section">
          {!this.state.done &&
            <form onSubmit={this.onSubmit} style={{marginBottom: 0}}>
              <input value={this.state.email} onChange={this.onChange} className="pop-over-input" type="email" placeholder="new@user.com"></input>
              <button style={{marginTop: 10}} className="button-small button-link" disabled={!isEnabled}>Send Link</button>
            </form>
          }
          {(this.state.done && !this.state.error) &&
            <>
              <div className="notification notifySuccess">Almost Done</div>
              <div>Please click the confirmation link sent to {this.state.email}.</div>
            </>
          }
          {(this.state.done && this.state.error) &&
            <>
              <div className="notification notifyError">Error</div>
              <div>Something went wrong, email not sent.</div>
            </>
          }       
        </section>
      </dialog>
    );
  }
}

class SignInCodeHandler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      done: false,
      error: false
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    
  }
  
  onChange(e) {
    this.setState({code: e.target.value});

  }
  
  async onSubmit(e) {
    e.preventDefault();
    this.setState({done: true});
    try {
      await this.props.api.post('/auth/email/' + this.state.code, {signInCode:this.state.code}); //update for proper api usage
      this.setState({error: false});
    } catch (error) {
      captureException(error);
      this.setState({error: true});
    }
  }
   
  render() {
    const isEnabled = this.state.code.length > 0;
    return (
      <dialog className="pop-over sign-in-pop">
        <NestedPopoverTitle>
          Use a sign in code
        </NestedPopoverTitle>
        <section className="pop-over-actions first-section">
          {!this.state.done &&
            <form onSubmit={this.onSubmit} style={{marginBottom: 0}}>
              Paste your temporary sign in code below
              <input value={this.state.code} onChange={this.onChange} className="pop-over-input" type="text" placeholder="cute-unique-cosmos"></input>
              <button style={{marginTop: 10}} className="button-small button-link" disabled={!isEnabled}>Sign In</button>
            </form>
          }
          {(this.state.done && !this.state.error) &&
            <>
              <div className="notification notifySuccess">Success!</div>
            </>
          }
          {(this.state.done && this.state.error) &&
            <>
              <div className="notification notifyError">Error</div>
              <div>Code not found or already used. Try signing in with email.</div>
            </>
          }       
        </section>
      </dialog>
    );
  }
}

const EmailSignInButton = ({onClick}) => (
  <button className="button button-small button-link has-emoji" onClick={() => {onClick();}}>
    Sign in with Email <span className="emoji email"></span>
  </button>
);
EmailSignInButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

const SignInPopWithoutRouter = (props) => (
  <LocalStorage name="destinationAfterAuth">
    {(destination, setDestination) => {
      const onClick = () => setDestination({
        expires: dayjs().add(10, 'minutes').toISOString(),
        to: {
          pathname: location.pathname,
          search: location.search,
          hash: hash,
        },
      });
      const {header, prompt, api, location, hash} = props;
      return (
        <NestedPopover alternateContent={() => <EmailHandler {...props}/>} startAlternateVisible={false}>
          {showEmailLogin => 
            <div className="pop-over sign-in-pop">
              {header}
              <section className="pop-over-actions first-section">
                {prompt}
                <SignInPopButton href={facebookAuthLink()} company="Facebook" emoji="facebook" onClick={onClick}/>
                <SignInPopButton href={githubAuthLink()} company="GitHub" emoji="octocat" onClick={onClick}/>
                <EmailSignInButton onClick={() => { onClick(); showEmailLogin(api); }}/>
              </section>
              <NestedPopover alternateContent={() => <SignInCodeHandler {...props}/>} startAlternateVisible={false}>
                {showCodeLogin =>
                  <section className="pop-over-actions last-section pop-over-info">
                    <button className="button-small button-tertiary button-on-secondary-background"  onClick={() => { onClick(); showCodeLogin(api); }}>
                      <span>Use a sign in code</span>
                    </button>
                  </section>
                }
              </NestedPopover>
            </div>
          }
        </NestedPopover>
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
  return <PopoverWithButton buttonClass='button button-small' buttonText='Sign in' passToggleToPop>
    <SignInPop {...props}/>
  </PopoverWithButton>;
}
