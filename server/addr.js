'use strict';

var assert = require('assert');

exports.parse = function(addr) {
  var coect = /([\w.#+]+)@([\w.]+)/.exec(addr);
  var parsed;
  if (coect) {
    parsed = {
      local: coect[1],
      domain: coect[2],
      full: addr,
      username: coect[1],
      group: null,             //dvd+js
      // backward compatibility
      user: coect[1],
      host: coect[2],
      addr: addr
    };
  } else {
    parsed = {
      local: null,
      domain: addr,
      full: addr,
      // backward compatibility
      user: null,
      host: addr,
      addr: addr
    };
  }
  assert(parsed.host);
  return parsed;
}

