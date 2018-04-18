// This shim helps attach React components to Jadelet files
// Also see templates/reactlet.jade

/* globals Set */

const ReactletTemplate = require("../templates/reactlet");
import {render} from 'react-dom';
import React from 'react';
let anchorId = 1;
let stack = [];
let uniques = new Set();
let batchPending = false;

module.exports = function(Component, props, guid=null) {
  const id = guid || `reactlet-${Component.name}-${anchorId}`;
  anchorId++;
  
  uniques.add(id);
  stack.push({
    id: id,
    render: (el) => { 
      render(
        React.createElement(Component, props),
        el
      );
    }
  });
  
  if(!batchPending) {
    batchPending = true;
    setTimeout(() => { 
      while(stack.length) {
        const {id, render} = stack.pop();
        const distinct = uniques.delete(id);
        if(!distinct){
          // The same ID was added multiple times.
          // If we proceed now, we'll render an older version.
          // ...So don't.
          continue;
        }
        const el = document.getElementById(id);
        if(!el) {
          // The page rerendered multiple times before
          // we got put into the dom.
          // Jadelet gonna jadelet, it's ok.
          continue;
        }
        render(el);
      }
      batchPending = false;
      if(
    });
  }

  return ReactletTemplate({id: id});
};
