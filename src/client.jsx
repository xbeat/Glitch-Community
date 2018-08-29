/* globals EDITOR_URL */
import 'details-element-polyfill';

import React from 'react';
import {render} from 'react-dom';

import {BrowserRouter} from 'react-router-dom';
import App from './app.jsx';

var passed = false;
try {
  const x = {a: 1, b: 2}; //Can we use const?
  let y = [1, 2, 3]; //Can we use let?
  var {a, ...b} = x; //Can we use object destructuring?
  
  passed = true;
} catch (error) {
  passed = false;
}

if (passed) {
  if (location.hash.startsWith("#!/")) {
    window.location.replace(EDITOR_URL + window.location.hash);
  } else {
    const dom = document.createElement('div');
    document.body.appendChild(dom);
    render(<BrowserRouter><App/></BrowserRouter>, dom);
  }
}