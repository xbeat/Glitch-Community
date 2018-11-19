/* globals APP_URL analytics */

import React from 'react';
import PropTypes from 'prop-types';
import {captureMessage} from '../../utils/sentry';

import {Redirect} from 'react-router-dom';
import LocalStorage from '../includes/local-storage';
import {CurrentUserConsumer} from '../current-user';
import ErrorPage from './error';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      to: { pathname: '/' },
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
      console.error("Login error.", deets);
      captureMessage("Login error", {extra: deets});
    }
  }
  
  componentDidMount() {
    this.authenticate();
  }
  
  render() {
    if (this.state.done) {
      const {destination} = this.props;
      const to = destination && (destination.expires > this.state.date) ? destination.to : { pathname: '/' };
      return <Redirect to={to}/>;
    } else if (this.state.error) {
      const genericDescription = "Hard to say what happened, but we couldn't log you in. Try again?";
      return <ErrorPage title={`${this.props.provider} Login Problem`} description={this.state.errorMessage || genericDescription}/>;
    }
    return <div className="content"></div>;
  }
}
LoginPage.propTypes = {
  api: PropTypes.any.isRequired,
  url: PropTypes.string.isRequired,
  provider: PropTypes.string.isRequired,
  setUser: PropTypes.func.isRequired,
  destination: PropTypes.shape({
    expires: PropTypes.number.isRequired,
    to: PropTypes.object.isRequired,
  }),
  hash: PropTypes.string,
};

const LoginPageContainer = (props) => (
  <LocalStorage name="destinationAfterAuth" default={undefined}>
    {(destination, setDestination) => (
      <CurrentUserConsumer>
        {(currentUser, fetched, {login}) => <LoginPage setUser={login} destination={destination} setDestination={setDestination} {...props}/>}
      </CurrentUserConsumer>
    )}
  </LocalStorage>
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
  return <LoginPageContainer {...props} provider="Email" url={url}/>;
};