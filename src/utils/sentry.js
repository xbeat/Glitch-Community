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

try {
  Sentry.init({
    dsn: 'https://4f1a68242b6944738df12eecc34d377c@sentry.io/1246508',
    environment: ENVIRONMENT,
    beforeSend(event) {
      const tokens = ['facebookToken', 'githubToken', 'persistentToken'];
      let json = JSON.stringify(event);
      tokens.forEach(token => {
        const regexp = new RegExp(`"${token}":"[^"]+"`, 'g');
        json = json.replace(regexp, `"${token}":"****"`);
      });
      return JSON.parse(json);
    },
  });
  
  Sentry.configureScope((scope) => {
    scope.setTag("PROJECT_DOMAIN", PROJECT_DOMAIN);
  });
  
  // Expose for use on the developer console:
  window.Sentry = Sentry;
} catch (error) {
  console.warn("Error initializing Sentry", error);
}
