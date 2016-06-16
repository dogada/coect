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
  var mounted = riot.mount(element || document.createElement('div'), tag, opts || {})
  if (!mounted || !mounted[0]) {
    console.error('ui.make', tag, opts, element)
    throw new Error('Can\'t mount tag <' + tag + '> using riot '  + riot.version + '. Is it loaded?')
  }
  return mounted[0]
}


function renderRiot(target, tag, data) {
  debug('renderRiot', tag, Object.keys(data))
  var fragments = {}
  fragments[target] = make(tag, data)
  Site.mount(fragments, data.name)
}

/**
   Echo params to callback.
*/
function echoParams(params, callback) {
  callback(null, params)
}

function getData(ctx, id, loader, done) {
  if (ctx.state[id]) {
    debug(`using cached data for ${id}`, ctx.params)
    done(null, ctx.state[id])
  } else {
    debug(`loading data for ${id}`, ctx.params)
    loader(function(err, data) {
      //if (err) return Site.error(`Can\'t load data for ${id}: ${err}.`)
      if (err) return
      if (data) {
        ctx.state[id] = data
        ctx.save()
      }
      done(null, data)
    })
  }
}

function mount(ctx, tag, opts) {
  var target = opts.target || 'main'
  var load = opts.load || echoParams
  var render = opts.render || renderRiot

  if (ctx.state[tag]) {
    debug('using cached data for ' + tag, ctx.params)
    debug('state', ctx.state)
    render(target, tag, ctx.state[tag])
  } else {
    debug(`loading data for tag ${tag}`, ctx.params)
    if (opts.data) render(target, tag, opts.data)
    else load(ctx, function(err, data) {
      if (err) return Site.error(`Can\'t show ${tag}: ${err}.`)
      if (data) {
        ctx.state[tag] = data
        ctx.save()
        render(target, tag, data)
      } else {
        Site.error(`No data for ${tag}.`)
      }
    })
  }
}

/**
   Load data using loader, cache it in HTML5 history and mount tag with data
   into site.main by default or other target using custom mounter.
   @param {function} opts.load Async loader of data required by tag
   @param {object} opts.data Data required by tag. Either loader or data should
   be provided.
   @param {string} opts.target - Dynamic part of website: main, sidebar, navbar, etc 

*/
function mounter(tag, opts={}) {
  return function(ctx) {
    mount(ctx, tag, opts)
  }
}

function renderTags(data, done) {
  if (data.content) Site.mountTag(data.content.tag, data.content.opts, {title: data.title})
  if (data.sidebar) Site.mountTag(data.sidebar.tag, data.sidebar.opts, {target: 'sidebar'})
  if (done) done()
}

function tagsView(store) {
  return function(ctx) {
    getData(ctx, 'data', next => store.get(ctx.path, next), (err, data) => {
      if (err) return Site.error(err)
      renderTags(data)
    })
  }
}

function pageHandler(page) {
  return (ctx) => {
    Site.update({
      page: {
        view: page.view,
        main: page.main,
        aside: page.aside,
        title: page.title,
        data: page.data,
        path: ctx.path,
        params: ctx.params
      }
    })
  }
}

function initPages({pages, app, route}) {
  for (let page of pages) {
    route(app.url(page.path), pageHandler(page))
  }
}


module.exports = {
  initPages,
  make,
  mount,
  mounter,
  getData,
  renderTags,
  tagsView
}
