const path = require('path');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const AutoprefixerStylus = require("autoprefixer-stylus");
const StatsPlugin = require('stats-webpack-plugin');


const PUBLIC = path.resolve(__dirname, 'public');
const SRC = path.resolve(__dirname, 'src');
const STYLES = path.resolve(__dirname, 'styles');
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
    filename: '[name].js',
    path: PUBLIC,
    publicPath: '/',
  },
  devtool: 'source-map',
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
      {
        test: /\.(js|jsx)$/,     
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.styl$/,
        include: STYLES,
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
    new MiniCssExtractPlugin({filename: '[name].css'}),
    new StatsPlugin('stats.json', {children: false, chunkModules: false, modules: false}),
  ],
  watchOptions: {
    ignored: /node_modules/,
  },
};
