import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import moment from 'moment-mini';

import Link from '../includes/link';
import LocalStorage from '../includes/local-storage';
import PopoverContainer from './popover-container';
import {DevToggles} from '../includes/dev-toggles';
import {captureException} from '../../utils/sentry';
import NestedPopover from './popover-nested.jsx';

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
  
  /*
  // Project Options Pop
const ProjectOptionsPop = ({...props}) => {
  return(
    <NestedPopover alternateContent={() => <AddProjectToCollectionPop {...props} api={props.api} togglePopover={props.togglePopover}/>}>
      { addToCollectionPopover => (
        <ProjectOptionsContent {...props} addToCollectionPopover={addToCollectionPopover}/>
      )}
    </NestedPopover>
  );
};


export default class NestedPopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alternateContentVisible: props.startAlternateVisible,
    };
    this.toggle = this.toggle.bind(this);
  }
  
  toggle() {
    this.setState(prevState => ({alternateContentVisible: !prevState.alternateContentVisible}));
  }
  
  render() {
    // Only use the provider on the sub menu
    // Nested consumers want the back button, not the open menu
    if (this.state.alternateContentVisible) {
      return (
        <Provider value={this.toggle}>
          {this.props.alternateContent(this.toggle)}
        </Provider>
      );
    }
    return this.props.children(this.toggle);
  }
}

  */
  
  render() {
    const isEnabled = this.state.email.length > 0;
    return (
      <section className="pop-over-actions last-section">
        {!this.state.done &&
          <form onSubmit={(e) => this.onSubmit(e)} style={{marginBottom: 0}}>
            Sign in with email
            <input value={this.state.email} onChange={this.onChange} className="pop-over-input" type="email" placeholder="new@user.com"></input>
            <button className="button-small button-link has-emoji" disabled={!isEnabled}>Send Link</button>
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
    );
  }
}

const EmailSignInButton = (props) => (
  <button className="button button-small button-link has-emoji" onClick={() => {props.onClick();}}>
    Email Sign In <span className="emoji email emoji-in-title"></span>
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
            <DevToggles>
              {(enabledToggles) => (
                enabledToggles.includes("Email Login") && <EmailSignInButton onClick={() => { onClick(); showEmailLogin(api); }}/>
              )}
            </DevToggles>
          </section>
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
          {visible && (
            <NestedPopover alternateContent={() => <CreateTeamPop {...props}/>} startAlternateVisible={createTeamOpen}>
              {showEmailLogin => <SignInPop {...props} {...{togglePopover, showEmailLogin}}/>}
            </NestedPopover>)}
        </div>
      )}
    </PopoverContainer>
  );
}
