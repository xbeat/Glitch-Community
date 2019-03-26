const path = require("path");

module.exports = async ({ config, mode }) => {
  // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // Make whatever fine-grained changes you need
  config.module.rules.push({
        test: /\.styl$/,
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
          },
        ],
        include: path.resolve(__dirname, "../src/components")
      });

  // Return the altered config
  return config;
};