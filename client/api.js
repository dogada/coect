var Store = require('./store')

module.exports = class CoectApi {

  constructor({server, site}) {
    this.server = server
    this.site = site
    this.errorHandler = this.site.error.bind(this.site)
  }

  callback(ok, fail) {
    return (err, data) => {
      if (err) return (fail || this.errorHandler)(err)
      ok(data)
    }
  }

  get(path, params, ok, fail) {
    this.server.get(path, params, this.callback(ok, fail))
  }

  post(path, data, ok, fail) {
    this.server.post(path, data, this.callback(ok, fail))
  }

  /**
     Get state from the url, remember it and emmit tag.update() to sync state
   */
  getState(tag, path, params) {
    this.get(path || '', params, this.callback(data => {
      tag.setState(data)
    }))
  }
 
  static makeApis({classes, opts}) {
    let apis = {}
    Object.keys(classes).forEach(key => {
      apis[key] = new classes[key](opts)
    })
    return apis
  }
}
