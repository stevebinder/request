const webpack = require('webpack');
const merge = require('webpack-merge');
const production = process.env.NODE_ENV === 'production';

const baseConfig = {
  output: {
    path: './dist',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
      },
    ],
  },
};

const devConfig = module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'babel-polyfill',
    './test/index.js',
  ],
  output: {
    filename: 'bundle.test.js',
  },
};

const prodConfig = {
  entry: [
    './src/index.js',
  ],
  output: {
    filename: 'bundle.js',
    libraryTarget: 'commonjs2',
  },
};

module.exports = merge(baseConfig, production ? prodConfig : devConfig);
