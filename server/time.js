'use strict';

function timestamp() {
  return new Date().toISOString()
}

function parse(ts) {
  return Date.parse(ts)
}

module.exports = {
  timestamp: timestamp,
  parse: parse
}
