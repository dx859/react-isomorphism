const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths');
const isProduction = process.env.NODE_ENV === 'production';

const config = {
  entry: paths.serverIndexJsPath,
  output: {
    path: paths.serverBuild,
    filename: '[name].js',
    // publicPath: '/public/',
    libraryTarget: 'commonjs2',
  },
};

module.exports = merge(require('./webpack.base')('node'), config);
