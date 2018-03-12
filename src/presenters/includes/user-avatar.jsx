import React from 'react';

const play = "https://cdn.hyperdev.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fplay.svg"
const whatsGlitchWide = "https://cdn.glitch.com/f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fwhats-glitch-wide.svg?1499885209761"
const whatsGlitchNarrow = "https://cdn.glitch.com/f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fwhats-glitch-narrow.svg?1499884900667"
const free = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Ffree.svg?1499350845981"

const whatsGlitchAlt = "Create a node app, or remix one. It updates as you type. Code with Friends!";
  
const UserAvatar = ({user}) => {
  if (isSignedIn()) {
    return null;
  }
  
  return (
    a.user(href=@userLink title=@login data-tooltip=@tooltipName data-tooltip-left=true @style)
    <a className="user" href={userLink} title={login} data-tooltip={tooltipName} data-tooltip-left=true style={style}>
    
  );
}

export default WhatIsGlitch;


/*
a.user(href=@userLink title=@login data-tooltip=@tooltipName data-tooltip-left=true @style)
  img.anon-avatar(class=@hiddenIfSignedIn width=32 height=32 src=@anonAvatar @alt)
  img(class=@hiddenUnlessSignedIn width=32 height=32 src=@userAvatarUrl @alt)
*/