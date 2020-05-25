const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths');
const isProduction = process.env.NODE_ENV === 'production';

const config = {
  entry: paths.clientIndexJsPath,
  output: {
    path: paths.appBuild,
    filename: '[name].[hash:8].js',
    publicPath: '/public/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: paths.clientIndexHtmlPath,
    }),
  ],
};

if (!isProduction) {
  config.devServer = {
    host: '0.0.0.0',
    compress: true,
    port: '8888',
    hot: true,
    overlay: {
      errors: true,
    },
    publicPath: '/public/',
    historyApiFallback: {
      index: '/public/index.html',
    },
  };
}

module.exports = merge(require('./webpack.base')(), config);
