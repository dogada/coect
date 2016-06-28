var debug = require('debug')('coect:ajax')
var {HttpError} = require('../common')

module.exports = class SiteAjaxServer {

  constructor({site, base}) {
    debug('SiteAjaxServer', base)
    this.base = base
    this.site = site
    this.defaultErrorHandler = this.site.error.bind(this.site)
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

  get(path, params, ok, fail) {
    if (!ok) {
      ok = params
      params = {}
    }
    debug('AjaxSite.get', path, params)
    var qs = $.extend({}, params)
    for (var k in qs) {
      if (qs[k] === undefined) delete qs[k]
    }
    if (qs._format === undefined) qs._format = 'json' 
    var url = this.base(path) + '?' + $.param(qs)
    debug('Ajax.get url=', url)
    return $.getJSON(url)
      .done(ok)
      .fail(this.failHandler(fail || this.defaultErrorHandler))
  }

  sendJson(method, path, data, ok, fail) {
    if (!ok && typeof data === 'function') {
      ok = data
      data = {}
    }

    return $.ajax({
      type: method,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      url: this.base(path),
      data: JSON.stringify(data)
    })
      .done(ok)
      .fail(this.failHandler(fail || this.defaultErrorHandler))
  }

  post(url, data, ok, fail) {
    this.sendJson('POST', url, data, ok, fail)
  }

  put(url, data, ok, fail) {
    this.sendJson('PUT', url, data, ok, fail)
  }

  del(url, ok, fail) {
    this.sendJson('DELETE', url, ok, fail)
  }

  save(path, data, ok, fail) {
    var url = this.base(path)
    debug('save', url, data)
    var id = data.id
    delete data.id
    if (id) this.put(url + (/\/$/.test(url) ? '' : '/') + id, data, ok, fail)
    else this.post(url, data, ok, fail)
  }

  getState(tag, path, params) {
    this.get(path, params, data => {
      tag.setState(data)
    })
  }
}
