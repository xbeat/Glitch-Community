const aliases = require('./webpack.config.js').resolve.alias;

const mappings = Object.keys(aliases).map((alias) => {
  return [`${alias}`, `${aliases[alias]}`];
})

console.log(`${mappings[4]}`);

module.exports = {
  settings: {
    'import/resolver': {
      alias: mappings,
    }
  }
};