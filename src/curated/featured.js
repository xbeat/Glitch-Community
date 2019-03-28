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
    title: 'Play Drums... In Your Browser',
    img: 'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fdrum.jpg?1553509760983',
    link: 'https://tartan-cilantro.glitch.me/',
  },
  {
    title: 'Generate Haikus',
    img: 'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fhaiku.jpg?1553509759185',
    link: 'https://haiku-generator.glitch.me/',
  },
  {
    title: 'List Your Fave Pokémon',
    img: 'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fpoke.jpg?1553509760546',
    link: 'https://favorite-pokemon.glitch.me/',
  },
];
