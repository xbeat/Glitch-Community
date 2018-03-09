// TODO: This file was created by bulk-decaffeinate.
// Check that you're happy with the conversion, then remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const WhatIsGlitchTemplate = require("../templates/includes/what-is-glitch");

module.exports = function(application) {

  const self = {
    baseUrl: application.normalizedBaseUrl(),

    hiddenIfUserIsSignedIn() {
      if (application.currentUser().isSignedIn()) { return 'hidden'; }
    },

    showVideoOverlay(event) {
      application.overlayVideoVisible(true);
      document.getElementsByClassName('video-overlay')[0].focus();
      return event.stopPropagation();
    }
  };

  return WhatIsGlitchTemplate(self);
};


/*
- play = "https://cdn.hyperdev.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fplay.svg"
- whatsGlitchWide = "https://cdn.glitch.com/f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fwhats-glitch-wide.svg?1499885209761"
- whatsGlitchNarrow = "https://cdn.glitch.com/f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fwhats-glitch-narrow.svg?1499884900667"
- free = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Ffree.svg?1499350845981"

section.what-is-glitch(class=@hiddenIfUserIsSignedIn)
  span
    a(href="https://glitch.com/about")
      figure(title="How Glitch works")
        img.wide(src=whatsGlitchWide alt="Create a node app, or remix one. It updates as you type. Code with Friends!")
        img.narrow(src=whatsGlitchNarrow alt="Create a node app, or remix one. It updates as you type. Code with Friends!")
    p
      span And it's
        img.free(src=free alt="free")
      span= ". "
      .video(click=@showVideoOverlay)
        img.play-button(src=play alt="play")
        span How it works in 2 minutes


*/