const merge = require('webpack-merge');
const path = require('path');
const base = require('./base.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(base, {
  devtool: 'source-map',
  output: {
    path: path.resolve('./dev'),
    filename: 'elementify.js',
    chunkFilename: 'modules/[name].js'    
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        options: {
          fix: true,
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dev'], {root: path.resolve('./')}),
    new BundleAnalyzerPlugin(),
  ]
});