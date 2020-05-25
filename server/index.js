const express = require('express');
const app = express();

if (process.env.NODE_ENV !== 'production') {
  require('./util/devSSR')(app);
}

app.listen(9000, () => console.log('Server started http://localhost:9000'));
