const paths = require('./paths');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

const config = {
  entry: paths.indexPath,
  output: {
    path: paths.appBuild,
    filename: '[name].[hash:8].js',
    publicPath: isProduction ? '/' : '/public/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: paths.appTemplate,
    }),
    // new HtmlWebpackPlugin({
    //   template: '!!ejs-webpack-loader!' + paths.appServerTemplate,
    //   filename: 'server.ejs',
    // }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ],
};

if (isDevelopment) {
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

module.exports = merge(baseConfig(), config);
