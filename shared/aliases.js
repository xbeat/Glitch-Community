const path = require('path');

const aliases = {
      'Components': path.resolve(__dirname, "../src/components"),
      'Utils': path.resolve(__dirname, "../src/utils"),
      'Curated': path.resolve(__dirname, "../src/curated"),
      'Models': path.resolve(__dirname, "../src/models"),
      'Shared': path.resolve(__dirname),
    }

module.exports = {
  aliases,
};