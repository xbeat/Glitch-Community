const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');



const PUBLIC = path.resolve(__dirname, 'public');
const SRC = path.resolve(__dirname, 'src');
const BASE = path.resolve(__dirname, '.');


module.exports = () => {
  
  let mode = 'development';
  if(process.env.NODE_ENV === 'production') {
    mode = 'production';
  }
  
  console.log(`Starting Webpack in ${mode} mode.`);
  
  return {
    mode,
    entry: {
      "client-bundle": `${SRC}/client.js`
    },
    output: {
      filename: '[name].js?[chunkhash]',
      path: PUBLIC,
      publicPath: '/',
    },
    optimization: {
      splitChunks: {
        chunks: 'initial',
        maxInitialRequests: 5,
        cacheGroups: {
          cache: {
            name: 'cache',
            test: /[\\/]src[\\/]cache[\\/]/,
            minSize: 0,
          },
          react: {
            name: 'react-bundle',
            test: /[\\/]node_modules[\\/]react/,
          },
          modules: {
            name: 'dependencies',
            test: /[\\/]node_modules[\\/]/,
            priority: -1,
          },
        },
      },
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          enforce: "pre",
          test: /\.jsx?$/,
          exclude: [/templates/, /cache/],
          include: SRC,
          loader: "eslint-loader",
          options: {
            fix: false,
            cache: `${SRC}/.eslintcache`, //caching tends to make the config stick, so disable this when reconfiguring
            emitError: false,
            emitWarning: true,
            failOnError: false,
          }
        },
        {
          test: /\.jsx?/,
          include: SRC,
          exclude: /node_modules/,
          loader : 'babel-loader'
        },
      ],
    },
    plugins: [
      new LodashModuleReplacementPlugin,
      new webpack.NoEmitOnErrorsPlugin(),
      new HtmlWebpackPlugin({
        filename: 'index.ejs',
        template: '!!raw-loader!views/index.ejs',
      }),
    ],
  };
}
