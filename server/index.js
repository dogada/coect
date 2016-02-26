'use strict';

var misc = require('./misc')

// unused on server mixins
var mixinsStub = {
  register: function() {
  }
}

var common = require('../common')

module.exports = common.object.assign({}, common, {
  addr: require('./addr'),
  guid: require('./guid'),
  json: require('./json'),
  time: require('./time'),
  misc: misc,
  isUndefined: misc.isUndefined,
  HttpError: misc.HttpError,
  janus: misc.janus,
  mixins: mixinsStub
})
