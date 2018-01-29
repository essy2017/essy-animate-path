'use strict';

var webpack   = require('webpack');
var path      = require('path');

module.exports = [
  {
    resolve: {
      extensions: ['.js', '.jsx']
    },

    entry: {
      line: path.join(__dirname, '/src/line.js'),
      sine: path.join(__dirname, '/src/sine.js')
    },
    output: {
      path: __dirname,
      filename: 'bundle-[name].js'
    },
    /*entry: path.join(__dirname, '/src/line.js'),

    output: {
      path: __dirname,
      filename: 'bundle-line.js'
    },*/

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
