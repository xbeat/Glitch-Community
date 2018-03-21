// This shim helps attach React components to Jadelet files
// Also see templates/reactlet.jade

const ReactletTemplate = require("../templates/reactlet");
import {render} from 'react-dom';
import React from 'react';
let anchorId = 1;

module.exports = function(Component, props) {
  const id = `reactlet-${Component.name}-${anchorId}`;
  anchorId++;

  setTimeout(() => { 
    const el = document.getElementById(id);
    if(!el) {
      // The page rerendered multiple times before
      // we got put into the dom.
      // Jadelet gonna jadelet, it's ok.
      return;
    }
    return render(
      React.createElement(Component, props),
      el
    );
  });

  return ReactletTemplate({id: id});
};
