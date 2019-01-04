/*
Example: 
{
  // Required fields:
  title: 'Make a Mash-up Comic',
  img: "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2FWebcomicNameFeature.png?1517409070264",
  
  // Optional fields:
  link: 'https://webcomicname-mashup.glitch.me' // if absent, tile won't be a link.
  imgTitle:  ''  // 'title' attribute on the <img>, which displays text on hover.
},
*/

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

var body = `<p>Follow along with Mythbusters Jr. on SCIENCE by remixing your own Glitch apps inspied by each episode.</p>
<p><b>Episode 1:</b></p>
<p>Can you make a viable, life-saving parachute out of duct tape?</p>
`;


export default [
  {
    feature_image: "https://cdn.glitch.com/3cef6b25-69ba-4fa9-aa32-cff0fedce195%2FMythbustersJR_TWITTER_adjustedv2.png?1545387248841",
    id: "5c1781e9ee6abd01fa9c4b2a",
    title: "Mythbusters Jr.",
    url: "/duct-tape-parachute/",
    embed: embed,
    body: body,
    color: '#D0F1FF',
  },
];
