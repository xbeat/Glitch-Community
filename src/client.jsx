/* globals EDITOR_URL, ENVIRONMENT, PROJECT_DOMAIN */
import './polyfills.js';
import * as Sentry from '@sentry/browser';

import React from 'react';
import {render} from 'react-dom';
import App from './app.jsx';

// First things first -- let's bring our error collection online:
try {
  Sentry.init({
    dsn: 'https://4f1a68242b6944738df12eecc34d377c@sentry.io/1246508',
    environment: ENVIRONMENT,
    beforeSend(event) {
      console.log("beforesend", event);
      if(event.breadcrumbs) {
        for(let crumb of event.breadcrumbs) {
          
        }
      }
      return event;
    },
  });

  Sentry.configureScope((scope) => {
    scope.setTag("bootstrap", "true");
    scope.setTag("PROJECT_DOMAIN", PROJECT_DOMAIN);
  });
} catch (error) {
  console.warn("Error bringing Sentry online", error);
}

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


// Assuming none of them threw, set the global bootstrap function.
// This will get used to check for compatibility in index.ejs
// If it isn't there, the browser is unsupported.
window.bootstrap = () => {
  if (location.hash.startsWith("#!/")) {
    window.location.replace(EDITOR_URL + window.location.hash);
    return;
  }
    
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  render(<App/>, dom);
};