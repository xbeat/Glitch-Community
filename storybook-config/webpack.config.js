const path = require("path");

module.exports = (baseConfig, env, defaultConfig) => {
  defaultConfig.module.rules.push({
    test: /\.styl/,
    include: path.resolve(__dirname, "../src/components"),
    use: [
      'style-loader',
      {
        loader: "css-loader?modules",
        options: {
          sourceMap: true,
          modules: true,
          localIdentName: '[name]__[local]___[hash:base64:5]'
        },
      },
      {
        loader: 'stylus-loader',
      }
    ],
  });
  defaultConfig.resolve.extensions.push(".styl");
  
  return defaultConfig;
};