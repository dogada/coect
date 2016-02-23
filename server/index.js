'use strict';

var misc = require('./misc')

// unused on server mixins
var mixinsStub = {
  register: function() {
  }
}

module.exports = {
  EPOCH: require('../common').EPOCH,
  dateDiff: require('../common').dateDiff,
  routes: require('../common/routes'),
  addr: require('./addr'),
  guid: require('./guid'),
  json: require('./json'),
  time: require('./time'),
  orm: require('../common/orm/'),
  misc: misc,
  isUndefined: misc.isUndefined,
  HttpError: misc.HttpError,
  Access: require('../common/access'),
  janus: misc.janus,
  object: require('../common/object'),
  mixins: mixinsStub
}
