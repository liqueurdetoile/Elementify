const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./base.js');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

module.exports = merge(base, {
  devtool: 'source-map',
  output: {
    path: path.resolve('./dev'),
    filename: 'elementify.tests.js',
    chunkFilename: 'modules/[name].tests.js'    
  },
  module: {
    rules: [
      {
        test: /\.js$|\.jsx$/,
        use: {
          loader: 'istanbul-instrumenter-loader',
          options: {
            esModules: true
          }
        },
        enforce: 'post',
        exclude: /node_modules|\.spec\.js$/,
      }
    ]
  },
  
  plugins: [
    new CleanWebpackPlugin(['coverage'], {root: path.resolve('./')})
  ]
});