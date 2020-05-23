const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const paths = require('./paths');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';
const modifyVars = {};

const getStyleLoaders = (isServer, preProcessor, loadOpts = {}, isModules = true) => {
  const loaders = [
    isServer && 'isomorphic-style-loader',
    !isServer && (isProduction ? MiniCssExtractPlugin.loader : 'style-loader'),
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
        modules: isModules
          ? {
              mode: 'local',
              localIdentName: '[local]_[hash:6]',
            }
          : undefined,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
        ],
      },
    },
  ].filter(Boolean);
  if (preProcessor) {
    loaders.push({
      loader: preProcessor,
      options: loadOpts,
    });
  }
  return loaders;
};

module.exports = function (isServer = false) {
  return {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'cheap-module-source-map',
    module: {
      rules: [
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'assets/[name].[hash:8].[ext]',
            publicPath: isProduction ? '/' : '/public/',
          },
        },
        {
          test: /\.js$/,
          // exclude: paths.nodeModulesPath,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env', '@babel/preset-react'],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              // isServer ? false : ['import', { libraryName: 'antd', style: true }],
            ].filter(Boolean),
          },
        },
        {
          test: /\.css$/,
          include: paths.clientPath,
          use: getStyleLoaders(isServer),
        },
        {
          test: /\.less$/,
          include: paths.nodeModulesPath,
          use: getStyleLoaders(
            isServer,
            'less-loader',
            {
              javascriptEnabled: true,
              modifyVars: modifyVars,
            },
            false,
          ),
        },
        {
          test: /\.less$/,
          include: paths.clientPath,
          use: getStyleLoaders(isServer, 'less-loader', {
            javascriptEnabled: true,
            modifyVars: modifyVars,
          }),
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'css/[name].[hash:8].css',
      }),
    ],
  };
};
