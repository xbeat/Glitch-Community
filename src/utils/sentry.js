/* globals ENVIRONMENT, PROJECT_DOMAIN */

//
// This utility wraps the Sentry library so that we can guarantee
// Sentry is initialized before its called.
//
// Only this file shoud import from '@sentry/browser',
// all other users of Sentry should import this file instead.
//

import * as Sentry from '@sentry/browser';

// First things first -- let's bring our error collection online:
try {
  Sentry.init({
    dsn: 'https://4f1a68242b6944738df12eecc34d377c@sentry.io/1246508',
    environment: ENVIRONMENT,
    beforeSend(event) {
      const json = JSON.stringify(event);
      const scrubbedJSON = json.replace(/"persistentToken":"[^"]+"/g, `"persistentToken":"****"`);
      const scrubbedEvent = JSON.parse(scrubbedJSON);

      return scrubbedEvent;
    },
  });
  
  Sentry.configureScope((scope) => {
    scope.setTag("PROJECT_DOMAIN", PROJECT_DOMAIN);
  });
  
  // Expose for use on the developer console:
  window.Sentry = Sentry;
} catch (error) {
  console.warn("Error bringing Sentry online", error);
}

// If the initialization failed, Sentry JS shoud still function,
// it'll just no-op.
export default Sentry;