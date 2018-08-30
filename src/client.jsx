/* globals EDITOR_URL */
import 'details-element-polyfill';

import React from 'react';
import {render} from 'react-dom';

import {BrowserRouter} from 'react-router-dom';
import App from './app.jsx';

try {
  /* eslint-disable no-unused-vars */
  let x = {a: 1, b: 2}; //Can we use let?
  const y = [1, 2, 3]; //Can we use const?
  const {a, ...aRest} = x; //Can we use object destructuring?
  const [b, ...bRest] = y; //Can we use array destructuring?
  const func = (arg, ...args) => arg(...args); //Can we define arrow functions?
  func(async arg => await arg, Promise.resolve()); //Can we do async/await?
  /* eslint-enable no-unused-vars */
  window.bootstrap = () => {
    if (location.hash.startsWith("#!/")) {
      window.location.replace(EDITOR_URL + window.location.hash);
    } else {
      const dom = document.createElement('div');
      document.body.appendChild(dom);
      render(<BrowserRouter><App/></BrowserRouter>, dom);
    }
  };
} catch (error) {
  // meh
}