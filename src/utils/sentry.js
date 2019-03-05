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

const beforeSendFailed = false;
const beforeBreadcrumbFailed = false;

try {
  Sentry.init({
    dsn: 'https://4f1a68242b6944738df12eecc34d377c@sentry.io/1246508',
    environment: ENVIRONMENT,
    release: `community@${BUILD_TIMESTAMP}`,
    ignoreErrors: SentryHelpers.ignoreErrors,
    beforeSend(event) {
      try {
        return SentryHelpers.beforeSend(PROJECT_DOMAIN, _env, event);
      } catch (error) {
        console.error(error);
        if (!beforeSendFailed) {
          // It'll probably fail next time too, so only log it once
          // Also wait a moment because capturing mid capture seems bad
          window.setTimeout(() => Sentry.captureException(error), 1);
          beforeSendFailed = true;
        }
        return event;
      }
    },
    beforeBreadcrumb(breadcrumb) {
      try {
        return SentryHelpers.beforeBreadcrumb(breadcrumb);
      } catch (error) {
        // The console doesn't create breadcrumbs here
        // If it did this would be a problem for us
        console.error(error);
        return breadcrumb;
      }
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
