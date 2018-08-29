/* globals EDITOR_URL Raven */
import 'details-element-polyfill';

import React from 'react';
import {render} from 'react-dom';

import {BrowserRouter} from 'react-router-dom';
import App from './app.jsx';

console.log('debugger?')
  debugger;
var passed = false;
try {
  /* eslint-disable no-unused-vars */
  let x = {a: 1, b: 2}; //Can we use let?
  const y = [1, 2, 3]; //Can we use const?
  const {a, ...aRest} = x; //Can we use object destructuring?
  const [b, ...bRest] = y; //Can we use array destructuring?
  const func = (arg, ...args) => arg(...args); //Can we define arrow functions?
  func(async arg => await arg, Promise.resolve()); //Can we do async/await?
  /* eslint-enable no-unused-vars */
  passed = true;
} catch (error) {
  passed = false;
  Raven.captureException(error);
  console.warn("Sorry, but your browser doesn't support recent JS features, so you're getting the barebones site");
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