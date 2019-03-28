const aliases = require('./webpack.config.js').resolve.alias;

const mappings = Object.keys(aliases).map((alias) => {
  return [`${alias}`, `${aliases[alias]}`];
})

module.exports = {
  settings: {
    'import/resolver': {
      alias: mappings,
    }
  }
};