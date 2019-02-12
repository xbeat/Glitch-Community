const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const AutoprefixerStylus = require("autoprefixer-stylus");

module.exports = {
  module: {
    rules: [
      {
        test: /\.styl/,
        include: path.resolve(__dirname, "../src/components"),
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
              use: [AutoprefixerStylus()],
            },
          },
        ]
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({filename: '[name].css?[chunkhash]'}),
  ],
};