const path = require('path');

const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');

module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig, env);

  config.module.rules.push({
    test: /\.styl$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader?modules',
        options: {
          sourceMap: true,
          modules: true,
          localIdentName: '[name]__[local]___[hash:base64:5]',
        },
      },
      {
        loader: 'stylus-loader',
      },
    ],
    include: path.resolve(__dirname, '../'),
  });
  config.resolve.modules.push(path.resolve('./'));

  return config;
};
