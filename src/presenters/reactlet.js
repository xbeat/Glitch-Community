// This shim helps attach React components to Jadelet files
// Also see presenters/reactlet.js

const ReactletTemplate = require("../templates/reactlet");
import {render} from 'react-dom';
import React from 'react';
let anchorId = 1;

module.exports = function(Component, props) {
  const id = `reactlet-anchor-${anchorId}`;
  anchorId++;

  setTimeout(() => { 
    const el = document.getElementById(id);
    if(!el) {
      console.error("Dom element not found.", id);
      return;
    }
    return render(
      React.createElement(Component, props),
      el
    );
  });

  return ReactletTemplate({id: id});
};
