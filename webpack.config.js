const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./app.jsx",
  output: {
    filename: "bundle.js"
  },
  watch: true,
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["react", "es2017", "stage-2"]
          // plugins: ["transform-runtime"]
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "template.html"
    })
  ]
};
