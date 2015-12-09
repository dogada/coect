// To reduce js-bundle size better import individual modules, i.e.
// keep this file empty and do `require('coect/ui')` instead of `require('coect').ui`
// but it gives "Browserify compile error: Cannot find module 'coect/ui'" 
// with Browserify 10.2.4 at least

module.exports = {
  ui: require('./ui'),
  mixins: require('./mixins')
}
