'use strict';

var debug = require('debug')('coect:site')
var objectAssign = require('./object').assign
var observable = require('riot-observable')

function Site(opts) {
  observable(this)
  objectAssign(this, opts || {})
  if (!this.state) this.state = {page: {}}
  this.hasWindow = (typeof window !== 'undefined')
}

Site.prototype.flash = function(msg, type) {
  this.trigger('coect:flash', msg, type)
}

Site.prototype.error = function(message) {
  if (window.console) console.log('Site.error', message)
  this.trigger('coect:error', message)
}

/**
   Set document title and rememebe it in `state.page` without triggering update.
   Usefull for setting document title from component and remember it for later
   serialization of state on server.
*/
Site.prototype.setPageTitle = function(title) {
  debug('setPageTitle', title)
  this.state.page.title = title || ''
  if (typeof document !== undefined) this.syncPageTitle()
}

Site.prototype.syncPageTitle = function () {
  var page = this.state.page
  if (page && page.title && page.title !== document.title) document.title = page.title
}

Site.prototype.setPage = function(page) {
  return this.update({page: page})
}

Site.prototype.getState = function(path) {
  return this.state[path]
}

Site.prototype.setState = function(path, state, root) {
  //assert state !== Site.state[path]
  debug('Site.setState', path, state)
  this.update({[path]: state}, root)
}

Site.prototype.update = function(data, root) {
  debug('Site.update', data)
  objectAssign(this.state, data)
  if (root === false) return
  root = root || this.root
  if (root) root.update()
  if (typeof document !== undefined) this.syncPageTitle()
}

Site.prototype.show = function(view, aside) {
  this.update({page: {view, aside}})
}

Site.prototype.go = function(url, reload) {
  if (this.hasWindow) {
    window.page.show(url)
    window.location.reload(true)
  }
}

module.exports = Site
