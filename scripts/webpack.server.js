const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths');
const isProduction = process.env.NODE_ENV === 'production';

const config = {
  entry: paths.serverIndexJsPath,
  output: {
    path: paths.serverBuild,
    filename: '[name].[hash:8].js',
    publicPath: '/public/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: '!!ejs-webpack-loader!' + paths.serverIndexHtmlPath,
      filename: 'server.ejs',
    }),
  ],
};

module.exports = merge(require('./webpack.base')(), config);
