/* globals ENVIRONMENT, PROJECT_DOMAIN */

//
// This utility wraps the Sentry library so that we can guarantee
// Sentry is initialized before its called.
//
// Only this file should import from '@sentry/browser',
// all other users of Sentry should import this file instead.
//

import * as Sentry from "@sentry/browser";
export * from "@sentry/browser";

const shouldSendError = PROJECT_DOMAIN === "community" || PROJECT_DOMAIN === "community-staging";

const filterSecrets = jsonEvent => {
  const tokens = ["facebookToken", "githubToken", "persistentToken"];
  tokens.forEach(token => {
    const regexp = new RegExp(`"${token}":"[^"]+"`, "g");
    jsonEvent = jsonEvent.replace(regexp, `"${token}":"****"`);
  });
  return jsonEvent;
};

try {
  Sentry.init({
    dsn: "https://4f1a68242b6944738df12eecc34d377c@sentry.io/1246508",
    environment: ENVIRONMENT,
    beforeSend(event, hint) {
      if (!shouldSendError) {
        return null;
      }

      if (
        hint.originalException &&
        hint.originalException.message === "Network Error"
      ) {
        // axios couldn't find the server it was supposed to make a request to - probably user network error
        return null;
      }

      const json = filterSecrets(JSON.stringify(event));
      return JSON.parse(json);
    },
    beforeBreadcrumb(breadcrumb) {
      if (breadcrumb.category === "console") {
        const extras = JSON.stringify(breadcrumb.data.extra);
        const filteredExtras = filterSecrets(extras);
        breadcrumb.data.extra = filteredExtras;
      }
      return breadcrumb;
    }
  });

  Sentry.configureScope(scope => {
    scope.setTag("PROJECT_DOMAIN", PROJECT_DOMAIN);
  });

  // Expose for use on the developer console:
  window.Sentry = Sentry;
} catch (error) {
  console.warn("Error initializing Sentry", error);
}
