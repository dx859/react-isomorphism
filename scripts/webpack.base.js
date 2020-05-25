const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const LoadablePlugin = require('@loadable/webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const DIST_PATH = path.resolve(__dirname, '../public/dist');
const production = process.env.NODE_ENV === 'production';
const development = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const getConfig = (target) => ({
  name: target,
  mode: development ? 'development' : 'production',
  target,
  entry: [`./client/main-${target}.js`].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            caller: { target },
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
        ],
      },
    ],
  },
  externals: target === 'node' ? ['@loadable/component', nodeExternals()] : undefined,
  output: {
    path: path.join(DIST_PATH, target),
    filename: production ? '[name]-bundle-[chunkhash:8].js' : '[name].js',
    publicPath: `/dist/${target}/`,
    libraryTarget: target === 'node' ? 'commonjs2' : undefined,
  },
  plugins: [
    new LoadablePlugin(),
    new MiniCssExtractPlugin(),
    production ? undefined : new webpack.HotModuleReplacementPlugin(),
  ].filter(Boolean),
});

module.exports = [getConfig('web'), getConfig('node')];
