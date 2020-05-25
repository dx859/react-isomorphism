const webpackDevMiddleware = require('webpack-dev-middleware');
const React = require('react');
const { renderToString } = require('react-dom/server');
const { ChunkExtractor } = require('@loadable/server');

function devSSR(app) {
  const webpackConfig = require('../../scripts/webpack.server');
  // const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpack = require('webpack');
  /* eslint-enable global-require, import/no-extraneous-dependencies */

  const compiler = webpack(webpackConfig);

  app.use(
    webpackDevMiddleware(compiler, {
      // publicPath: '/dist/web',
      // serverSideRender: true,
      writeToDisk: true,
    }),
  );
}

module.exports = devSSR;
