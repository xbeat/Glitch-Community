// Add new aliases in shared/aliases.js. This file will automatically pull them here so Babel doesn't complain about them.
// More details at https://www.npmjs.com/package/eslint-import-resolver-alias

const aliases = require('./shared/aliases');

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
