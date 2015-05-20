"use strict";

module.exports = function(config) {
  config.set({
    browsers: ['Chrome'],
    singleRun: true,
    frameworks: ['mocha'],
    files: ['frontend-tests.webpack.js'],
    preprocessors: {
      'frontend-tests.webpack.js': ['webpack']
    },
    reporters: ['dots'],
    webpack: {
      module: {
        loaders: [{
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        }]
      }
    },
    webpackServer: {
      noInfo: true    // don't print to console
    }
  });
};
