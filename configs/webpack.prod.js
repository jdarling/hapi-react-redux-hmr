var webpack = require("webpack");
var path = require("path");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  target:  "web",
  cache:   false,
  context: __dirname,
  debug:   false,
  devtool: false,
  entry:   ["../web/src/app"],
  output:  {
    path:          path.resolve(__dirname, "../web/site"),
    filename:      "app.js",
    chunkFilename: "[name].[id].js",
    publicPath:    "/"
  },
  plugins: [
    new webpack.DefinePlugin({"process.env": {NODE_ENV: '"production"'}}),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../web/src/index.html'),
      hash: true,
      filename: 'index.html',
      minify: {
        collapseWhitespace: true
      }
    }),
  ],
  module:  {
    loaders: [
      {test: /\.json$/, loaders: ["json"]},
      {test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
      {test: /\.less$/, loader: "style!css!less"},
      {test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000'},
    ],
    postLoaders: [
    ],
    noParse: /\.min\.js/
  },
  resolve: {
    modulesDirectories: [
      "src",
      "node_modules",
      "web_modules"
    ],
    extensions: ["", ".json", ".js"]
  },
  node:    {
    __dirname: true,
    fs:        'empty'
  }
};
