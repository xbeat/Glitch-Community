/* globals APP_URL analytics */

import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { captureException } from '../../utils/sentry';

import useLocalStorage from '../../state/local-storage';
import { useAPI } from '../../state/api';
import { useCurrentUser } from '../../state/current-user';
import { EmailErrorPage, OauthErrorPage } from './error';

// The Editor may embed /login/* endpoints in an iframe in order to share code.
// NotifyParent allows the editor to receive messages from this page.
// We use this to pass on auth success/failure messages.
function notifyParent(message = {}) {
  if (window.parent === window) {
    return;
  }

  // Specifically target our same origin (APP_URL) ;
  // we're only communicating between the editor and its corresponding ~community site,
  // not across other environments.

  // Add 'LoginMessage' to all messages of this type so that the Editor
  // can filter for them specifically.
  message.type = 'LoginMessage';

  window.parent.postMessage(message, APP_URL);
}

const RedirectToDestination = () => {
  const [destination, setDestination] = useLocalStorage('destinationAfterAuth', null);

  React.useEffect(() => {
    setDestination(undefined);
  }, []);

  if (destination && destination.expires > new Date().toISOString()) {
    return <Redirect to={destination.to} />;
  }

  return <Redirect to="/" />;
};

const LoginPage = ({ provider, url }) => {
  const api = useAPI();
  const { login } = useCurrentUser();

  const [done, setDone] = React.useState(false);
  const [didError, setDidError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);

  const perform = async () => {
    try {
      const { data } = await api.post(url);
      if (data.id <= 0) {
        throw new Error(`Bad user id (${data.id}) after ${provider} login`);
      }

      console.log('LOGGED IN', data.id);
      login(data);

      setDone(true);
      analytics.track('Signed In', { provider });
      notifyParent({ success: true, details: { provider } });
    } catch (error) {
      const errorData = error && error.response && error.response.data;
      if (errorData && errorData.message) {
        setErrorMessage(errorData.message);
      }
      setDidError(true);

      if (error && error.response && error.response.status !== 401) {
        console.error('Login error.', errorData);
        captureException(error);
      }
      const details = { provider, error: errorData };
      notifyParent({ success: false, details });
    }
  };
  React.useEffect(() => {
    perform();
  }, [provider, url]);

  if (done) {
    return <RedirectToDestination />;
  }
  if (didError) {
    const genericDescription = "Hard to say what happened, but we couldn't log you in. Try again?";
    if (provider === 'Email') {
      return <EmailErrorPage title={`${provider} Login Problem`} description={errorMessage || genericDescription} />;
    }
    return <OauthErrorPage title={`${provider} Login Problem`} description={errorMessage || genericDescription} />;
  }
  return <div className="content" />;
};
LoginPage.propTypes = {
  provider: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

const OAuthLoginPage = ({ error, provider, url }) => {
  if (error === 'access_denied') {
    return <RedirectToDestination />;
  }
  return <LoginPage provider={provider} url={url} />;
};
OAuthLoginPage.propTypes = {
  error: PropTypes.string,
};
OAuthLoginPage.defaultProps = {
  error: null,
};

export const FacebookLoginPage = ({ code, error }) => {
  const callbackUrl = `${APP_URL}/login/facebook`;
  const url = `/auth/facebook/${code}?callbackURL=${encodeURIComponent(callbackUrl)}`;
  return <OAuthLoginPage error={error} provider="Facebook" url={url} />;
};

export const GitHubLoginPage = ({ code, error }) => {
  const url = `/auth/github/${code}`;
  return <OAuthLoginPage error={error} provider="GitHub" url={url} />;
};

export const GoogleLoginPage = ({ code, error }) => {
  const callbackUrl = `${APP_URL}/login/google`;
  const url = `/auth/google/callback?code=${code}&callbackURL=${encodeURIComponent(callbackUrl)}`;
  return <OAuthLoginPage error={error} provider="Google" url={url} />;
};

export const SlackLoginPage = ({ code, error }) => {
  const callbackUrl = `${APP_URL}/login/slack`;
  const url = `/auth/slack/callback?code=${code}&callbackURL=${encodeURIComponent(callbackUrl)}`;
  return <OAuthLoginPage error={error} provider="Slack" url={url} />;
};

export const EmailTokenLoginPage = ({ token }) => {
  const url = `/auth/email/${token}`;
  return <LoginPage provider="Email" url={url} />;
};
