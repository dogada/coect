var Store = require('./store')

module.exports = class CoectApi {

  constructor({url, ajax}) {
    this.url = url
    this.ajax = ajax || new Store()
   }

  get(path, params, done) {
    this.ajax.get(this.url(path), params, done)
  }

  post(path, params, done) {
    this.ajax.post(this.url(path), params, done)
  }

  put(path, params, done) {
    this.ajax.put(this.url(path), params, done)
  }

  del(path, params, done) {
    this.ajax.del(this.url(path), params, done)
  }

  /**
     Get state from the url, remember it and emmit tag.update() to sync state
   */
  getState(tag, path, params) {
    this.api.get(path || '', params, tag.site.callback(data => {
      tag.setState(data)
    }))
  }
  
}

