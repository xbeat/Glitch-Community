const path = require("path");

module.exports = (baseConfig, env, defaultConfig) => {
  defaultConfig.module.rules.push({
    test: /\.styl/,
    include: path.resolve(__dirname, "../src/components"),
    loaders: [
      require.resolve('style-loader'),
      {
        loader: require.resolve('css-loader'),
        options: {
          importLoaders: 1,
          modules: false
        }
      }
    ]
  });
  defaultConfig.resolve.extensions.push(".styl");

  return defaultConfig;
};
