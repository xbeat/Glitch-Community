const path = require('path');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const AutoprefixerStylus = require("autoprefixer-stylus");
const StatsPlugin = require('stats-webpack-plugin');

const BUILD = path.resolve(__dirname, 'build');
const SRC = path.resolve(__dirname, 'src');
const SHARED = path.resolve(__dirname, 'shared');
const CSS_MODULES = path.resolve(__dirname, 'src/components');
const STYLES = path.resolve(__dirname, 'styles');
const NODE_MODULES = path.resolve(__dirname, 'node_modules');
const STYLE_BUNDLE_NAME = 'styles';


let mode = 'development';
if (process.env.NODE_ENV === 'production') {
  mode = 'production';
}

console.log(`Starting Webpack in ${mode} mode.`);

module.exports = {
  mode,
  entry: {
    "client": `${SRC}/client.jsx`,
    [STYLE_BUNDLE_NAME]: `${STYLES}/styles.styl`,
  },
  output: {
    filename: '[name].js?[contenthash]-v1',
    path: BUILD,
    publicPath: '/',
  },
  devtool: mode === 'production' ? 'source-map' : 'cheap-module-source-map',
  optimization: {
    splitChunks: {
      chunks: 'initial',
      maxInitialRequests: 5,
      cacheGroups: {
        curated: {
          name: 'curated',
          test: /[\\/]src[\\/]curated[\\/]/,
          minSize: 0,
        },
        react: {
          name: 'react',
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
      new TerserPlugin({terserOptions: {safari10: true}, sourceMap: true}),
    ],
    noEmitOnErrors: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.jsx?$/,
        include: SRC,
        loader: "eslint-loader",
        options: {
          fix: false,
          cache: false, // Keep this off, it can use a lot of space.  Let Webpack --watch does the heavy lifting for us.
          emitError: false,
          emitWarning: true,
          failOnError: false,
        }
      },
      oneOf: [
      { 
        test: /\.(js|jsx)$/,
        include: mode === "development" ? [SRC, SHARED, NODE_MODULES, path.resolve(__dirname, '.')] : [SRC, SHARED, NODE_MODULES],
        loader: 'babel-loader',
        query: { compact: false }
      },
      {
        test: /\.styl/,
        include: CSS_MODULES,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader?modules',
            options: {
              sourceMap: true,
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]'
            },
          },
          {
            loader: 'stylus-loader',
            options: {
              compress: mode === 'production', // Compress CSS as part of the stylus build
              use: [AutoprefixerStylus()],
            },
          },
        ]
      },
      {
        test: /\.styl$/,
        include: STYLES,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: mode !== 'production', // no css source maps in production
            },
          },
          {
            loader: 'stylus-loader',
            options: {
              compress: mode === 'production', // Compress CSS as part of the stylus build
              use: [AutoprefixerStylus()],
            },
          },
        ]
      },
    ],
  },
  plugins: [
    new LodashModuleReplacementPlugin(),
    new MiniCssExtractPlugin({filename: '[name].css?[chunkhash]'}),
    new StatsPlugin('stats.json', {all: false, entrypoints: true, publicPath: true}),
  ],
  watchOptions: {
    ignored: /node_modules/,
  },
};
