var debug = require('debug')('coect:store')

class Store {

  constructor() {
    this.cache = {}
  }

  failHandler(done) {
    return function(xhr, text) {
      console.error('Store.failHandler text:', text, 'xhr: ', xhr)
      var json = xhr.responseJSON
      var err = 'Error ' + xhr.status + ': ' + xhr.statusText
      if (json && json.error) err = json.error
      else if (json && json.errors) {
        var e = json.errors[0]
        err = e.param + ': ' + e.msg
      }
      Site.error(err)
      done(err)
    }
  }

  successHandler(done) {
    return function(data) {
      done(null, data)
    }
  }

  get(url, params, done) {
    if (!done) {
      done = params
      params = {}
    }
    debug('Store.get', url, params)
    var qs = $.extend({}, params)
    for (var k in qs) {
      if (qs[k] === undefined) delete qs[k]
    }
    if (qs._format === undefined) qs._format = 'json' 
    url += '?' + $.param(qs)
    debug('Store.get url=', url)
    return $.getJSON(url)
      .done(this.successHandler(done))
      .fail(this.failHandler(done))
  }

  sendJson(method, url, data, done) {
    if (!done && typeof data === 'function') {
      done = data
      data = {}
    }

    return $.ajax({
      type: method,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      url: url,
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

  save(url, data, done) {
    debug('save', url, data)
    var id = data.id
    delete data.id
    if (id) this.put(url + (/\/$/.test(url) ? '' : '/') + id, data, done)
    else this.post(url, data, done)
  }
}

module.exports = Store
