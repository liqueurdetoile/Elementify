const merge = require('webpack-merge');
const base = require('./base.js');

module.exports = merge(base, {
  devtool: 'inline-source-map',
  mode: 'development',
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
        exclude: /node_modules|\.spec\.js$/
      }
    ]
  }
});
