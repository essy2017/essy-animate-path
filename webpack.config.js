'use strict';

var webpack   = require('webpack');
var path      = require('path');

module.exports = [
  {
    resolve: {
      extensions: ['.js', '.jsx']
    },

    entry: path.join(__dirname, '/src/index.js'),

    output: {
      path: __dirname,
      filename: 'index.js'
    },

    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: ['node_modules'],
          use: [
            'babel-loader'
          ]
        }
      ]
    },

    stats: {
      colors: true
    }
  }
];
