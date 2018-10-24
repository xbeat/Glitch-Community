/* globals EDITOR_URL */
import './polyfills.js';

import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import {CurrentUserProvider} from './presenters/current-user.jsx';
import {UserPrefsProvider} from './presenters/includes/user-prefs.jsx';
import {DevTogglesProvider} from './presenters/includes/dev-toggles.jsx';
import {Notifications} from './presenters/notifications.jsx';

import Router from './presenters/pages/router.jsx';

const App = () => (
  <React.StrictMode>
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
  </React.StrictMode>
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
  } else {
    const dom = document.createElement('div');
    document.body.appendChild(dom);
    render(<App/>, dom);
  }
};