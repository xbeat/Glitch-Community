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
  
  let clientConstants = {
    APP_URL: 'https://glitch.com',
    API_URL: 'https://api.glitch.com/',
    EDITOR_URL: 'https://glitch.com/edit/',
    CDN_URL: 'https://cdn.glitch.com',
    GITHUB_CLIENT_ID: "b4cb743ed07e20abf0b2",
    FACEBOOK_CLIENT_ID: "660180164153542",
  };
  if (process.env.RUNNING_ON === 'staging') {
    clientConstants = {
      APP_URL: 'https://staging.glitch.com',
      API_URL: 'https://api.staging.glitch.com/',
      EDITOR_URL: 'https://staging.glitch.com/edit/',
      CDN_URL: 'https://cdn.staging.glitch.com',
      GITHUB_CLIENT_ID: "65efbd87382354ca25e7",
      FACEBOOK_CLIENT_ID: "1858825521057112",
    };
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
        cacheGroups: {
          cache: {
            name: 'cache',
            test: /[\\/]src[\\/]cache/,
            chunks: 'all',
            minSize: 0,
          },
          react: {
            name: 'react-bundle',
            test: /[\\/]node_modules[\\/]react/,
            chunks: 'all',
          },
          modules: {
            name: 'dependencies',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
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
        filename: 'index.html',
        template: 'views/index.ejs',
        templateParameters: clientConstants,
      }),
    ],
  };
}
