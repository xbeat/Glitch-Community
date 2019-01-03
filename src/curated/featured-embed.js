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
<div class="glitch-embed-wrap" style="height: 420px; width: 50%;">
  <iframe
    allow="geolocation; microphone; camera; midi; encrypted-media"
    src="https://glitch.com/embed/#!/embed/egg-drop?path=README.md&previewSize=100"
    alt="egg-drop on Glitch"
    style="height: 100%; width: 50%; border: 0;">
  </iframe>
</div>
`;

var body = `Follow along with Mythbusters Jr. on SCIENCE by remixing your own Glitch apps inspied by each episode.

Episode 1:

Can you make a viable, life-saving parachute out of duct tape?`;


export default [
  {
    feature_image: "/culture/content/images/2018/12/Screen-Shot-2018-12-21-at-10.06.41.png",
    id: "5c1781e9ee6abd01fa9c4b2a",
    title: "Episode 1: Duct Tape Special",
    url: "/duct-tape-parachute/",
    embed: embed,
    body: body,
  },
];
