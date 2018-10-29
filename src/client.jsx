/* globals EDITOR_URL */
import './polyfills.js';
import * as Sentry from '@sentry/browser';

import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import {CurrentUserProvider} from './presenters/current-user.jsx';
import {UserPrefsProvider} from './presenters/includes/user-prefs.jsx';
import {DevTogglesProvider} from './presenters/includes/dev-toggles.jsx';
import {Notifications} from './presenters/notifications.jsx';

import Router from './presenters/pages/router.jsx';

// First things first -- let's bring our error collection online:
try {
  Sentry.init({
    dsn: 'https://029cb06346934232bbc4ea4f4c16f1b7@sentry.io/1247156',
    environment: window.ENVIRONMENT,
    serverName: window.PROJECT_DOMAIN,
    beforeSend(event) {
      if (event.user) {
        // Don't send user's email address
        delete event.user.email;
      }
      return event;
    },
  });

  Sentry.configureScope((scope) => {
    scope.setUser({tags: {bootstrap: true}});
  });
} catch (error) {

const App = () => (
  <BrowserRouter>
    <Notifications>
      <UserPrefsProvider>
        <DevTogglesProvider>
          <CurrentUserProvider>
            {api => <Router api={api}/>}
          </CurrentUserProvider>
        </DevTogglesProvider>
      </UserPrefsProvider>
    </Notifications>
  </BrowserRouter>
);

// Here's a bunch of browser support tests
// If any of them don't work we can't run in this browser
/* eslint-disable no-unused-vars */
let x = {a: 1, b: 2}; // Can we use let?
const y = [1, 2, 3]; // Can we use const?
const {a, ...aRest} = x; // Can we use object destructuring?
const [b, ...bRest] = y; // Can we use array destructuring?
const str = `${b}23`; // Can we use formatted strings?
const func = (f, ...args) => f(...args); // Can we define arrow functions?
func(async arg => await arg, Promise.resolve()); // Can we do async/await?
/* eslint-enable no-unused-vars */

// Assuming none of them threw, set the global
// This will get used to check for compatibility
// If it isn't there the browser is unsupported
window.bootstrap = () => {
  if (location.hash.startsWith("#!/")) {
    window.location.replace(EDITOR_URL + window.location.hash);
    return;
  }
    
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  render(<App/>, dom);
};