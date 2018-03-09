import React from 'react';

const play = "https://cdn.hyperdev.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fplay.svg"
const whatsGlitchWide = "https://cdn.glitch.com/f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fwhats-glitch-wide.svg?1499885209761"
const whatsGlitchNarrow = "https://cdn.glitch.com/f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fwhats-glitch-narrow.svg?1499884900667"
const free = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Ffree.svg?1499350845981"

const whatsGlitchAlt = "Create a node app, or remix one. It updates as you type. Code with Friends!";
  
const WhatIsGlitch = ({isSignedIn, showVideoOverlay}) => {
  if (isSignedIn()) {
    return null;
  }
  
  return (
    <section class="what-is-glitch">
      <span>
        <a href="https://glitch.com/about">
          <figure title="How Glitch works">
            <img class="wide" src={whatsGlitchWide} alt={whatsGlitchAlt}/>
            <img class="narrow" src={whatsGlitchNarrow} alt={whatsGlitchAlt}/>
          </figure>
        </a>
        <p>
          <span>And it's <img class="free" src={free} alt="free"/></span>
          <span>. </span>
          <div class="video" onClick={showVideoOverlay}>
            <img class="play-button" src={play} alt="play"/>
            <span>How it works in 2 minutes</span>
          </div>
        </p>
      </span>
    </section>
  );
}

export default WhatIsGlitch;
