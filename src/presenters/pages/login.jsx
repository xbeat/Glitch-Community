/* globals APP_URL analytics */

import React from 'react';
import PropTypes from 'prop-types';
import {captureMessage} from '../../utils/sentry';

import {Redirect} from 'react-router-dom';
import {CurrentUserConsumer} from '../current-user.jsx';
import ErrorPage from './error.jsx';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      done: false,
      error: false,
      errorMessage: null,
    };
  }
  
  async authenticate() {
    const {api, provider, url} = this.props;
    try {
      const {data} = await api.post(url);
      if (data.id <= 0) {
        throw new Error(`Bad user id (${data.id}) after ${provider} login`);
      }
      console.log("LOGGED IN", data);
      this.props.setUser(data);
      this.setState({done: true});
      analytics.track("Signed In", {provider});
    } catch (error) {
      this.setState({error: true});
      const errorData = error && error.response && error.response.data;
      if (errorData && errorData.message) {
        this.setState({errorMessage: errorData.message});
      }
      const deets = {provider, error: errorData};
      console.error("OAuth login error.", deets);
      captureMessage("Oauth login error", {extra: deets});
    }
  }
  
  componentDidMount() {
    this.authenticate();
  }
  
  render() {
    if (this.state.done) {
      return <Redirect to={this.props.hash ? `/#${this.props.hash}` : '/'}/>;
    } else if (this.state.error) {
      const genericDescription = "Hard to say what happened, but we couldn't log you in. Try again?";
      return <ErrorPage title="OAuth Login Problem" description={this.state.errorMessage || genericDescription}/>;
    }
    return <div className="content"></div>;
  }
}
LoginPage.propTypes = {
  api: PropTypes.any.isRequired,
  url: PropTypes.string.isRequired,
  provider: PropTypes.string.isRequired,
  setUser: PropTypes.func.isRequired,
  hash: PropTypes.string,
};

const LoginPageContainer = (props) => (
  <CurrentUserConsumer>
    {(currentUser, fetched, {login}) => <LoginPage setUser={login} {...props}/>}
  </CurrentUserConsumer>
);

export const FacebookLoginPage = ({code, ...props}) => {
  const callbackUrl = `${APP_URL}/login/facebook`;
  const url = `/auth/facebook/${code}?callbackURL=${encodeURIComponent(callbackUrl)}`;
  return <LoginPageContainer {...props} provider="Facebook" url={url}/>;
};

export const GitHubLoginPage = ({code, ...props}) => {
  const url = `/auth/github/${code}`;
  return <LoginPageContainer {...props} provider="GitHub" url={url}/>;
};

export const EmailTokenLoginPage = ({token, ...props}) => {
  const url = `/auth/email/${token}`;
  return <LoginPageContainer {...props} provider="email" url={url}/>;
};