'use strict';

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


module.exports = {
  make: make
}
