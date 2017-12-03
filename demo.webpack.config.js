/* global __dirname, require, module*/

const webpack = require('webpack');
const path = require('path');
const env = require('yargs').argv.env; // use --env with webpack 2

let libraryName = 'demo';

let plugins = [], outputFile;

outputFile = libraryName + '.js';

const config = {
  entry: {
    client: __dirname + '/demo-src/index.js'
  },
  devtool: 'source-map',
  output: {
    path: __dirname + '/demo',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./demo-src')],
    extensions: ['.json', '.js']
  },
  plugins: plugins
};

module.exports = config;
