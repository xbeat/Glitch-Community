const path = require('path');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");



class OutputOnBuildStart {
  apply(compiler) {
    compiler.hooks.watchRun.tap("OutputWatchStart", () => console.log('Files changed, rebuilding...'));
  }
}


const PUBLIC = path.resolve(__dirname, 'public');
const SRC = path.resolve(__dirname, 'src');
const STYLES = path.resolve(__dirname, 'styles');
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
      "client-bundle": `${SRC}/client.js`,
      "styles": `${STYLES}/styles.styl`,
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
            test: /[\\/]node_modules[\\/]react[-\\/]/,
          },
          modules: {
            name: 'dependencies',
            test: /[\\/]node_modules[\\/]/,
            priority: -1,
          },
        },
      },
      minimizer: [
        new UglifyJsPlugin({uglifyOptions: {safari10: true}}),
      ],
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
        {
          test: /\.styl$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            "stylus-loader",
          ] 
        },
      ],
    },
    plugins: [
      new OutputOnBuildStart,
      new LodashModuleReplacementPlugin,
      new webpack.NoEmitOnErrorsPlugin(),
      new ManifestPlugin({
        fileName: "scripts.json",
        filter: ({isInitial, name}) => isInitial && name.endsWith('.js'),
      }),
      new ManifestPlugin({
        fileName: "styles.json",
        filter: ({isInitial, name}) => isInitial && name.endsWith('.css'),
      }),
       new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: "[name].css?[hash]",
        chunkFilename: "[id].[hash].css"
      })
    ],

  };
}