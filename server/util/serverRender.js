const ejs = require('ejs');

function serverRender(template, opts = {}) {
  let defaultOpts = {
    content: '',
    initialState: '',
    meta: '', //helmet.meta.toString(),
    title: '<title>招采平台</title>', // helmet.title.toString(),
    style: '', // helmet.style.toString(),
    link: '', //helmet.link.toString(),
    materialCss: '', // sheetsRegistry.toString()
  };
  return ejs.render(template, Object.assign(defaultOpts, opts));
}

module.exports = serverRender;
