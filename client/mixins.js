'use strict';

var riot = require('riot')
var debug = require('debug')('ui:mixins')

function ajaxPostJson(url, data) {
  return $.ajax({
    type: 'POST',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    url: url,
    data: JSON.stringify(data)
  })
}

function failHandler(xhr, text) {
  console.error('mixins.failHandler text:', text, 'xhr: ', xhr)
  var json = xhr.responseJSON
  var err = 'Error ' + xhr.status + ': ' + xhr.statusText
  if (json && json.error) err = json.error
  else if (json && json.errors) {
    var e = json.errors[0]
    err = e.param + ': ' + e.msg
  }
  console.log('error', err)
  Site.error(err)
}


function sendJson(method, url, data) {
  if (typeof data === 'undefined') {
    data = url
    url = method
    method = 'POST'
  }

  return $.ajax({
    type: method,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    url: url,
    data: JSON.stringify(data)
  }).fail(failHandler)
}

function postJson(url, data) {
  sendJson('POST', url, data)
}

function poutJson(url, data) {
  debug('poutJson', url, data)
  var id = data.id
  delete data.id
  if (id) {
    
    return sendJson('PUT', url + (/\/$/.test(url) ? '' : '/') + id, data)
  } else {
    return sendJson('POST', url, data)
  }
}

/**
   Extend `this` with `this.opts` inside Riot component.
*/
var coectContext = {
  init: function () {
    $.extend(this, this.opts)
  },
  postJson: postJson,
  sendJson: sendJson,
  poutJson: poutJson,
  failHandler: failHandler,
  ajaxPostJson: ajaxPostJson
}

function register(opts) {
  riot.mixin('coect-context',
             $.extend(coectContext, opts))
}

module.exports = {
  register: register
}
