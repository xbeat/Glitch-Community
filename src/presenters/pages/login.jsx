/* globals APP_URL analytics Raven */

import React from 'react';
import PropTypes from 'prop-types';

import {Redirect} from 'react-router-dom';
import ErrorPage from './error.jsx';
import Loader from '../includes/loader.jsx';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      done: false,
      error: false,
    };
  }
  
  async authenticate() {
    const {api, provider, url} = this.props;
    try {
      const {data} = await api.post(url);
      if (data.id <= 0) {
        throw new Error(`Bad user id (${data.id}) after ${provider} login`);
      }
      analytics.track("Signed In", {provider});
      console.log("LOGGED IN", data);
      this.setState({done: true});
    } catch (error) {
      this.setState({error: true});
      const errorData = error && error.response && error.response.data;
      const deets = {provider, error: errorData};
      console.error("OAuth login error.", deets);
      Raven.captureMessage("Oauth login error", {extra: deets});
    }
  }
  
  componentDidMount() {
    this.authenticate();
  }
  
  render() {
    if (this.state.done) {
      return <Redirect to="/"/>;
    } else if (this.state.error) {
      return <ErrorPage title="OAuth Login Problem" body="Hard to say what happened, but we couldn't log you in. Try again?"/>;
    }
    return (
      <div className="content">
        <Loader/>
      </div>
    );
  }
}
LoginPage.propTypes = {
  api: PropTypes.any.isRequired,
  url: PropTypes.string.isRequired,
  provider: PropTypes.string.isRequired,
};

export const FacebookLoginPage = ({api, code}) => {
  const callbackUrl = `${APP_URL}/login/facebook`;
  const url = `/auth/facebook/${code}?callbackURL=${encodeURIComponent(callbackUrl)}`;
  return <LoginPage api={api} provider="Facebook" url={url}/>
};

export const GitHubLoginPage = ({api, code}) => {
  const url = `/auth/github/${code}`;
  return <LoginPage api={api} provider="GitHub" url={url}/>;
};