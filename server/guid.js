'use strict';

var assert = require('assert');
var path = require('path');
var tflow = require('tflow');

function parseSync(guid) {
  var parsed = /^([\w\-]+)@([\w\.\-\:]+)\/([\w\.\/\-@]+)$/.exec(guid)
  if (!parsed) return null;
  return {
    user: parsed[1],
    host: parsed[2],
    addr: parsed[1]+ '@' + parsed[2],
    path: parsed[3],
    full: guid
  }
}

/**
   Parse guid and return it.
*/
function parse(guid, done) {
  tflow([
    function() {
      var parsed = parseSync(guid)
      if (!parsed) return this.fail('guid.parse: ' + guid)
      else this.next(parsed)
    }
  ], done)
}

/**
   Make guid from parts.
   @param {object} data
   @param {string} [data.user] 
   @param {string} [data.host] Either host or addr should be provided.
   @param {string} [data.addr] Either addr or host should be provided.
   @param {string} data.path
   @param {callback} done
*/
function make(data, done) {
  var guid;
  tflow([
    function() {
      if (data.addr && (data.host || data.user)) return this.fail('guid.make: addr and user&host are mutually exclusive.')
      if (!data.addr && !data.host) return this.fail('guid.make: addr or host are required.')
      if (!data.path) return this.fail('guid.make: path is required.')
      this.next();
    },
    function() {
      if (data.addr) guid = data.addr
      else if (data.user) guid = data.user + '@' + data.host
      else guid = data.host

      guid += '/' + data.path;
      //ensure we can parse just made guid
      parse(guid, this);
    },
    function(parsed) {
      this.done(guid);
    },
  ], done);
}

/**
   Make child guid in 'data' namespace.
   @param {guid} parent
*/
function child(parent) {
  var parts = [parent, 'data'].concat(Array.prototype.slice.call(arguments, 1))
  return path.join.apply(undefined, parts);
}

/**
   Make child guid in 'list' namespace.
   @param {guid} parent
   @param {guid} listid

*/
function list(parent, listid) {
  return path.join(parent, 'list', listid)
}

module.exports = {
  parse: parse,
  parseSync: parseSync,
  make: make,
  child: child,
  data: child,
  list: list
};
