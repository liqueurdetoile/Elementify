const merge = require('webpack-merge');
const path = require('path');
const base = require('./base.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(base, {
  devtool: 'source-map',
  mode: 'development',
  output: {
    path: path.resolve('./dev'),
    filename: 'elementify.js',
    chunkFilename: 'modules/[name].js'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new BundleAnalyzerPlugin()
  ]
});
