const path = require('path');
const webpackDevMiddleware = require('webpack-dev-middleware');
const express = require('express');
const React = require('react');
const { renderToString } = require('react-dom/server');
const { ChunkExtractor } = require('@loadable/server');

const app = express();

app.use(express.static(path.join(__dirname, '../public')));

if (process.env.NODE_ENV !== 'production') {
  /* eslint-disable global-require, import/no-extraneous-dependencies */
  const webpackConfig = require('../scripts/webpack.base.bck');
  // const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpack = require('webpack');
  /* eslint-enable global-require, import/no-extraneous-dependencies */

  const compiler = webpack(webpackConfig);
  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: '/dist/web',
      // serverSideRender: true,
      writeToDisk: true,
    }),
  );
  app.use(require('webpack-hot-middleware')(compiler));
}

const nodeStats = path.resolve(__dirname, '../public/dist/node/loadable-stats.json');

const webStats = path.resolve(__dirname, '../public/dist/web/loadable-stats.json');

app.get('*', (req, res) => {
  const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats });

  const { default: App } = nodeExtractor.requireEntrypoint();

  const webExtractor = new ChunkExtractor({ statsFile: webStats });
  const jsx = webExtractor.collectChunks(React.createElement(App));

  const html = renderToString(jsx);

  res.set('content-type', 'text/html');
  res.send(`<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
      />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>Document</title>
      ${webExtractor.getLinkTags()}
      ${webExtractor.getStyleTags()}
    </head>
    <body>
      <div id="main">${html}</div>
      ${webExtractor.getScriptTags()}
    </body>
  </html>
  `);
});

// eslint-disable-next-line no-console
app.listen(9000, () => console.log('Server started http://localhost:9000'));
