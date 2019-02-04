const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.styl$/,
        loaders: ["css-loader", "stylus-loader"],
        include: path.resolve(__dirname, "../")
      }
    ]
  }
};