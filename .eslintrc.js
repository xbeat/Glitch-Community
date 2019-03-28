// Add new aliases in webpack.config.js. This file will automatically pull them here so Babel doesn't complain about them.
const aliases = require('./webpack.config.js').resolve.alias;

const mappings = Object.keys(aliases).map((alias) => {
  return [`${alias}`, `${aliases[alias]}`];
});

module.exports = {
  settings: {
    'import/resolver': {
      alias: mappings,
    },
  },
};
