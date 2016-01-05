var debug = require('debug')('coect:store')

class Store {
 
  failHandler(done) {
    return function(xhr, text) {
      console.error('failHandler text:', text, 'xhr: ', xhr)
      var json = xhr.responseJSON
      var err = 'Error ' + xhr.status + ': ' + xhr.statusText
      if (json && json.error) err = json.error
      else if (json && json.errors) {
        var e = json.errors[0]
        err = e.param + ': ' + e.msg
      }
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
      params = null
    }
    if (params) url += '?' + $.param(params)
    debug('get', url)
    return $.getJSON(url)
      .done(this.successHandler(done))
      .fail(this.failHandler(done))
  }
}

module.exports = Store
