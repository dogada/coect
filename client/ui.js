'use strict';

var debug = require('debug')('coect:ui')
var riot = require('riot')

/**
   Make component from given tag and opts.
   @param {string} tag Riot tag name (for example, 'site-sidebar')
   @param {object} [opts={}]
   @param {DOMElement} [element=document.createElement('div')]
   @return Instantiated and mounted to elem Riot tag
*/
function make(tag, opts, element) {
  var comp = riot.mount(element || document.createElement('div'), tag, opts || {})[0]
  if (!comp) {
    console.error('ui.make', tag, opts, element)
    throw new Error('Can\'t mount tag <' + tag + '> using riot '  + riot.version + '. Is it loaded?')
  }
  return comp
}


function riotMounter(tag, data) {
  debug('riotMounter', tag, Object.keys(data))
  Site.mount(make(tag, data), data.name)
}

/**
   Echo params to callback.
*/
function echoLoader(params, callback) {
  callback(null, params)
}

/**
   Load data using loader, cache it in HTML5 history and mount tag with data
   into site.main by default or other target using custom mounter.
   @param loader {(function|object)} Should load data and call mounter(tag, data) 
*/
function showTag(tag, loader=echoLoader, mounter=riotMounter) {
  return function(ctx) {
    if (ctx.state.data) {
      debug('using cached data for ' + tag, ctx.params)
      mounter(tag, ctx.state.data)
    } else {
      debug(`loading data for tag ${tag}`, ctx.params)
      if (typeof loader === 'object') mounter(tag, loader)
      else loader(ctx, function(err, data) {
        if (err) return Site.error(`Can\'t show ${tag}: ${err}.`)
        if (data) {
          ctx.state.data = data
          ctx.save()
          mounter(tag, data)
        } else {
          Site.error(`No data for ${tag}.`)
        }
      })
    }
  }
}

module.exports = {
  make,
  showTag: showTag
}
