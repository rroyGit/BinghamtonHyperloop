const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty'
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/statics/index.html",
      filename: "./index.html"
    })
  ]
};