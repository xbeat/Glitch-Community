const path = require("path");

module.exports = {
  module: {
    rules: [
      {
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
        include: path.resolve(__dirname, "../")
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: 'html-loader',
          },
          {
            loader: 'markdown-loader',
            options: {
            }
          },
        ],
        include: path.resolve(__dirname, "../"),
        exclude: /node_modules/
      }
    ]
  }
};
