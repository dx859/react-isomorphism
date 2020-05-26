const Koa = require('koa');
const app = new Koa();

if (process.env.NODE_ENV !== 'production') {
  require('./util/devSSR')(app);
}

app.listen(9000, () => console.log('Server started http://localhost:9000'));
