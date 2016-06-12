'use strict';

var util = require('util')
var _ = require('lodash')
var riot = require('riot')

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


function makeState(data) {
  var page = {}
  if (data.content) Object.assign(page, {
      view: data.content.tag,
      data: data.content.opts
  })
  if (data.sidebar) Object.assign(page, {
      aside: data.sidebar.tag,
      asideData: data.sidebar.opts
  })
  return {page}
}

function renderTags(res, data) {
  if (global.Site) {
    global.Site.state = (data.page ? data : makeState(data))
    res.render('layout', {
      layout: riot.render('site-layout', {site: global.Site})
    })
  } else { // old apps support
    res.render('index', Object.assign({}, data, {
      content: data.content && riot.render(data.content.tag, data.content.opts),
      sidebar: data.sidebar && riot.render(data.sidebar.tag, data.sidebar.opts)
    }))
  }
}

function janus(req, res, next, htmlHandler) {
  return function (err, data) {
    if (err) return next(err)
    if (req.query._format === 'json') res.json(data || {})
    else if (htmlHandler) htmlHandler(data)
    else renderTags(res, data)
  }
}

module.exports = {
  HttpError: HttpError,
  isUndefined: isUndefined,
  mapKeys: mapKeys,
  mapInto: mapKeys,
  extendRequest: extendRequest,
  janus,
  renderTags
}
