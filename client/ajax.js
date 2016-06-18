var debug = require('debug')('coect:ajax')
var {HttpError} = require('../common')

module.exports = class AjaxServer {

  constructor({base}) {
    debug('AjaxServer base', base)
    this.base = base
  }

  failHandler(done) {
    return function(xhr, text) {
      console.error('Ajax.failHandler text:', text, 'xhr: ', xhr)
      var json = xhr.responseJSON
      var err = 'Error ' + xhr.status + ': ' + xhr.statusText
      if (json && json.error) err = json.error
      else if (json && json.errors) {
        var e = json.errors[0]
        err = e.param + ': ' + e.msg
      }
      done(new Error(err))
    }
  }

  successHandler(done) {
    return function(data) {
      done(null, data)
    }
  }

  get(path, params, done) {
    if (!done) {
      done = params
      params = {}
    }
    debug('Store.get', path, params)
    var qs = $.extend({}, params)
    for (var k in qs) {
      if (qs[k] === undefined) delete qs[k]
    }
    if (qs._format === undefined) qs._format = 'json' 
    var url = this.base(url) + '?' + $.param(qs)
    debug('Ajax.get url=', url)
    return $.getJSON(url)
      .done(this.successHandler(done))
      .fail(this.failHandler(done))
  }

  sendJson(method, path, data, done) {
    if (!done && typeof data === 'function') {
      done = data
      data = {}
    }

    return $.ajax({
      type: method,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      url: this.base(path),
      data: JSON.stringify(data)
    }).done(this.successHandler(done))
      .fail(this.failHandler(done))
  }

  post(url, data, done) {
    this.sendJson('POST', url, data, done)
  }

  put(url, data, done) {
    this.sendJson('PUT', url, data, done)
  }

  del(url, done) {
    this.sendJson('DELETE', url, done)
  }

  save(path, data, done) {
    var url = this.base(path)
    debug('save', url, data)
    var id = data.id
    delete data.id
    if (id) this.put(url + (/\/$/.test(url) ? '' : '/') + id, data, done)
    else this.post(url, data, done)
  }
}
