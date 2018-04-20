const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = exports = {
  "extends": [
    "eslint:recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:react/recommended",
  ],
  env: {
      'es6': true,        // We are writing ES6 code
      'browser': true,    // for the browser
      'amd': true,       // supporting define() and require()
  },
  "parser": "babel-eslint",
  "parserOptions": {
    "sourceType": "module",
    "allowImportExportEverywhere": false,
  },
  "plugins": [
    "jsx-a11y", // https://www.npmjs.com/package/eslint-plugin-jsx-a11y
  ],
  "globals": {
    "$": true,
    "module": true,
  },
  "rules": {
    // Intentional config:
    "no-console": OFF,
    "no-else-return": ERROR,
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "semi": ["error", "always"],
    "no-debugger": WARN,
    
    "react/no-unescaped-entities": ["error", {"forbid": [">", "}"]}], // permit ' and " in jsx html
    "react/prop-types": [OFF], // disabled so we can use composed prop-types
    
    // Unintentionally off -- we should fix these, then enable them
    // Looking for a good first PR to contribute to the site?
    // Turn one of these on and fix it up!
    //"no-undef": OFF,
    //"no-unused-vars": OFF,
    //"no-useless-escape": OFF,
    //"no-empty": OFF,
  }
}
