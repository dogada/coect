'use strict';

var util = require('util')
var _ = require('lodash')

function HttpError(status, message) {
  if (!(this instanceof HttpError)) return new HttpError(status, message)
  if (typeof message === 'undefined') {
    message = status
    status = 500
  }
  Error.call(this)
  Error.captureStackTrace(this, this.constructor)
  this.message = message
  this.name = this.constructor.name //set our function’s name as error name.
  this.status = status
}

util.inherits(HttpError, Error)

function isUndefined(obj) {
  return (typeof obj === 'undefined')
}

function mapKeys(obj, list, fn) {
  for (var i = 0; i < list.length; i++) {
    var key = list[i]
    obj[key] = fn(key)
  }
  return obj
}

function extendRequest(params) {
  return function(req, res, next) {
    _.assign(req, params)
    next()
  }
}

module.exports = {
  HttpError: HttpError,
  isUndefined: isUndefined,
  mapKeys: mapKeys,
  mapInto: mapKeys,
  extendRequest: extendRequest
}
