import React from 'react';
var embed = `
<!-- Copy and Paste Me -->
<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    allow="geolocation; microphone; camera; midi; encrypted-media"
    src="https://glitch.com/embed/#!/embed/egg-drop?path=README.md&previewSize=100"
    alt="egg-drop on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>
`;

var body = 
  <>
    <p>Follow along with Mythbusters Jr. by remixing your own Glitch apps inspired by each episode.</p>
    <p><b>Episode 1:</b></p>
    <p>Can you make a viable, life-saving parachute out of duct tape?</p>
  </>;

export default 
  {
    image: "https://cdn.glitch.com/3cef6b25-69ba-4fa9-aa32-cff0fedce195%2FMythbustersJR_TWITTER_adjustedv2.png?1545387248841",
    mask: "mask-4",
    title: "Mythbusters Jr.",
    url: "/duct-tape-parachute/",
    embed: embed,
    body: body,
    color: '#D0F1FF',
  };
