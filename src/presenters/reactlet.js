// This shim helps attach React components to Jadelet files
// Also see templates/reactlet.jade

const ReactletTemplate = require("../templates/reactlet");
import {render} from 'react-dom';
import React from 'react';
let anchorId = 1;
let stack = [];
let batchPending = false;

module.exports = function(Component, props) {
  const id = `reactlet-${Component.name}-${anchorId}`;
  anchorId++;
  
  stack.push[{
    id: id,
    render: (el) => { 
      render(
      React.createElement(Component, props),
      el
    );
  }}];
  
  if(batchPending) {
    return;
  }

  batchPending = true;
  setTimeout(() => { 
    while(stack.length) {
      const {id, render} = stack.pop();
      const el = document.getElementById(id);
      if(!el) {
        // The page rerendered multiple times before
        // we got put into the dom.
        // Jadelet gonna jadelet, it's ok.
        console.log("reactlet: skipping render.");
        return;
      }
      render(el);
    };
    batchPending = false;
  });

  return ReactletTemplate({id: id});
};
