const path = require('path');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const AutoprefixerStylus = require("autoprefixer-stylus");


const PUBLIC = path.resolve(__dirname, 'public');
const SRC = path.resolve(__dirname, 'src');
const STYLES = path.resolve(__dirname, 'styles');
const STYLE_BUNDLE_NAME = 'styles';


let mode = 'development';
if(process.env.NODE_ENV === 'production') {
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
    filename: '[name].js?[chunkhash]',
    path: PUBLIC,
    publicPath: '/',
  },
  watchOptions: {
    ignored: /node_modules/,
  },
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
      new TerserPlugin({terserOptions: {safari10: true}}),
    ],
  },
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
          cache: false, // Keep this off, it can use a lot of space.  Let Webpack --watch does the heavy lifting for us.
          emitError: false,
          emitWarning: true,
          failOnError: false,
        }
      },
      {
        test: /\.jsx?/,
        include: SRC,
        exclude: /node_modules/,
        loader : 'babel-loader',
      },
      {
        test: /\.styl$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'stylus-loader',
            options: {
              compress: true, // Compress CSS as part of the stylus build
              use: [AutoprefixerStylus()],
            },
          },
        ]
      },
    ],
  },
  devtool: 'source-map',
  plugins: [
    new LodashModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new ManifestPlugin({
      fileName: "scripts.json",
      filter: ({isInitial, name}) => (
        isInitial && name.endsWith('.js') &&
          name !== `${STYLE_BUNDLE_NAME}.js` // omit the no-op CSS bundle .js file
        ),
    }),
    new ManifestPlugin({
      fileName: "styles.json",
      filter: ({isInitial, name}) => isInitial && name.endsWith('.css'),
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css?[contenthash]"
    }),
  ],
};
