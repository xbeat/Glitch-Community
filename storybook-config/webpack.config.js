const path = require('path');
<<<<<<< HEAD
const appConfig = require('../webpack.config.js');
=======
>>>>>>> e10be3f50f3fc226556adbfd862a7daa6f27be16

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
<<<<<<< HEAD
        test: /\.styl$/,
        use: [
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
      },
    ],
  },
  resolve: { 
    extensions: [".js"],
    alias: appConfig.resolve.alias 
  },
};
=======
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
    include: path.resolve(__dirname, '../src/components'),
  });
  
  config.mode = 'development';

  // Return the altered config
  return config;
};
>>>>>>> e10be3f50f3fc226556adbfd862a7daa6f27be16
