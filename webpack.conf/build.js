const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const base = require('./base.js');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(base, {
  devtool: false,
  output: {
    path: path.resolve('./lib'),
    filename: 'elementify.min.js',
    chunkFilename: 'modules/[name].min.js'
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {root: path.resolve('./')}),
    new UglifyJsPlugin()
  ]
});