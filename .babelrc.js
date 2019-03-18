const path = require('path');

module.exports = {
  "presets": [
    "@babel/preset-react",
    [
      "@babel/preset-env",
      {
        "modules": false,
        "targets": {
          "chrome": "41",
          "ie": "11",
          "edge": "16"
        },
        "useBuiltIns": "usage"
      }
    ]
  ],
  "plugins": [
    "lodash",
    "@babel/syntax-dynamic-import",
    "@babel/plugin-proposal-class-properties",
    [
      require.resolve("babel-plugin-module-resolver"),
      {
        "root": [path.resolve('./')],
        "alias": {
          "Components": "./src/components"
        }
      }
    ]
  ],
  "sourceType": "unambiguous"
}