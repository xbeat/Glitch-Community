/* globals EDITOR_URL */

// Import Sentry early to help it initialize.
import {configureScope} from './utils/sentry';
import {getBrowserJSCompatibility} from './utils/compatibility';
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

// This function will get used to check for compatibility in index.ejs
// If the user has the right level of JS support, allow them to access the editor.
// If they don't, we can still show the homepage, just without code editor/embeds.
window.bootstrap = () => {
  if (getBrowserJSCompatibility()) {
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
  }

  const dom = document.createElement('div');
  document.body.appendChild(dom);
  render(<App/>, dom);
};