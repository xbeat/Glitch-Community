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

// make sure image urls use https
export default [
  {
    title: 'What Were the First Tweets?',
    img: 'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2FGlitch_2019_Illo_FeaturedAppTiles1_Tweet%20v2.jpg?1551709691713',
    link: 'https://firsttweets.glitch.me/',
  },
  {
    title: 'Take a Virtual Road Trip',
    img: 'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2FGlitch_2019_Illo_FeaturedAppTiles1_Library%20v2.jpg?1551709692203',
    link: 'https://library-of-places.glitch.me/',
  },
  {
    title: 'Hmm... Which Emoji?',
    img: 'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2FGlitch_2019_Illo_FeaturedAppTiles1_Emoji%20v2.jpg?1551709692864',
    link: 'https://emoji-suggester.glitch.me/',
  }
];
