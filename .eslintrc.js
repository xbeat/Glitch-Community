const appConfig = require('./webpack.config.js');

appConfig.module

module.exports = {
  settings: {
    'import/resolver': {
      alias: [
        ['Components', './src/components'],
        ['Utils', './src/utils'],
        ['Curated', './src/curated'],
        ['Models', './src/models'],
        ['Shared', './shared'],
      ]
    }
  }
};