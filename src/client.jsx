/* globals EDITOR_URL */


// Import Sentry early to help it initialize.
import {configureScope} from './utils/sentry';
import './polyfills.js';

// Init our dayjs plugins
import dayjs from 'dayjs';
import relativeTimePlugin from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTimePlugin);
import convertPlugin from '../shared/dayjs-convert';
dayjs.extend(convertPlugin);

import React from 'react';
import {render} from 'react-dom';
import App from './app.jsx';

// This function is used in index.ejs to set up the app
window.bootstrap = () => {
  if (location.hash.startsWith("#!/")) {
    window.location.replace(EDITOR_URL + window.location.hash);
    return;
  }
  
  // Mark that bootstrapping has occurred,
  // ..and more importantly, use this as an excuse
  // to call into Sentry so that its initialization
  // happens early in our JS bundle.
  configureScope((scope) => {
    scope.setTag("bootstrap", "true");
  });

  const dom = document.createElement('div');
  document.body.appendChild(dom);
  render(<App/>, dom);
};