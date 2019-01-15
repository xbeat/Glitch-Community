/* globals ENVIRONMENT, PROJECT_DOMAIN */

//
// This utility wraps the Sentry library so that we can guarantee
// Sentry is initialized before its called.
//
// Only this file shoud import from '@sentry/browser',
// all other users of Sentry should import this file instead.
//

import * as Sentry from '@sentry/browser';
export * from '@sentry/browser';

function scrubTokens(data, ...tokens) {
  const json = JSON.stringify(data);
  const scrubbedJSON = json.replace(/"persistentToken":"[^"]+"/g, `"persistentToken":"****"`);
  const scrubbedData = JSON.parse(scrubbedJSON);
  return scrubbedData;
}

try {
  Sentry.init({
    dsn: 'https://4f1a68242b6944738df12eecc34d377c@sentry.io/1246508',
    environment: ENVIRONMENT,
    beforeSend: event => scrubTokens(event, 'persistentToken', 'facebookToken', 'githubToken'),
  });
  
  Sentry.configureScope((scope) => {
    scope.setTag("PROJECT_DOMAIN", PROJECT_DOMAIN);
  });
  
  // Expose for use on the developer console:
  window.Sentry = Sentry;
} catch (error) {
  console.warn("Error initializing Sentry", error);
}

