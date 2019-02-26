/* globals BUILD_TIMESTAMP, ENVIRONMENT, PROJECT_DOMAIN, _env */

//
// This utility wraps the Sentry library so that we can guarantee
// Sentry is initialized before its called.
//
// Only this file should import from '@sentry/browser',
// all other users of Sentry should import this file instead.
//

import * as Sentry from '@sentry/browser';

export * from '@sentry/browser';
const SentryHelpers = require('../../shared/sentryHelpers');

try {
  Sentry.init({
    dsn: 'https://4f1a68242b6944738df12eecc34d377c@sentry.io/1246508',
    environment: ENVIRONMENT,
    release: `community@${BUILD_TIMESTAMP}`,
    beforeSend(event, hint) {
      return SentryHelpers.beforeSend(PROJECT_DOMAIN, _env, event, hint);
    },
    beforeBreadcrumb(breadcrumb) {
      return SentryHelpers.beforeBreadcrumb(breadcrumb);
    },
  });

  Sentry.configureScope((scope) => {
    scope.setTag('PROJECT_DOMAIN', PROJECT_DOMAIN);
  });

  // Expose for use on the developer console:
  window.Sentry = Sentry;
} catch (error) {
  console.warn('Error initializing Sentry', error);
}
