const webpackDevMiddleware = require('webpack-dev-middleware');
const ReactDOMServer = require('react-dom/server');
const React = require('react');
const axios = require('axios');
const path = require('path');
const paths = require('../../scripts/paths');
const serverRender = require('./serverRender');

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
  app.all('/public/**');
  app.all('*', compilerSSR);
}

const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios
      .get('http://127.0.0.1:8888/public/server.ejs')
      .then((res) => resolve(res.data))
      .catch(reject);
  });
};

async function compilerSSR(req, res) {
  const template = await getTemplate();
  const nodeExtractor = new ChunkExtractor({ statsFile: path.join(paths.serverBuild, 'loadable-stats.json') });

  const { default: App } = nodeExtractor.requireEntrypoint();

  const html = ReactDOMServer.renderToString(nodeExtractor.collectChunks(React.createElement(App)));
  res.set('content-type', 'text/html');
  res.send(serverRender(template, { content: html }));
}

module.exports = devSSR;
