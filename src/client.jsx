/* globals EDITOR_URL */
import 'details-element-polyfill';

import React from 'react';
import {render} from 'react-dom';

import {BrowserRouter} from 'react-router-dom';
import App from './app.jsx';

console.log('asdf')
if (location.hash.startsWith("#!/")) {
  window.location.replace(EDITOR_URL + window.location.hash);
} else {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  render(<BrowserRouter><App/></BrowserRouter>, dom);
}