'use strict';
var debug = require('debug')('coect:model')
var _ = require('lodash')
var tflow = require('tflow')
var validator = require('validator')
var util = require('util')
var object = require('../object')

function modelize(Klass, done) {
  return function(err, data) {
    if (err) return done(err)
    if (data && data.length) data = data.map(row => new Klass(row))
    else if (data) data = new Klass(data)
    return done(null, data)
  }
}


class Model {
  constructor(props) {
    object.assign(this, props)
  }

  save(parent, done) {
    if (!done) {
      done = parent
      parent = null
    }
    if (this.id) this.constructor.update(this.id, this, done)
    else this.constructor.create(this, done)
  }

  toString() {
    return `${ this.constructor.modelName() }(${ this.id })`
  }
}

/**
   Links model to the actual database tables.
   Same model can be spread across different shards.
   Different models can be stored in same database table.

   Must be called before any usage of model.
   @param {function} table -function that accepts an id and return knex driver
   for the database shard that keeps this model.
   @edid {EDID} a configred EDID generator used for generating distributed ids.
*/
Model.configure = function(table, edid) {
  // this is class (constructor) for the static methods
  this.table = table
  this.edid = edid
}

Model.modelName = function() {
  if (this.name) return this.name
  else {
    var ret = this.toString()
    return ret.slice('function '.length, ret.indexOf('('))
  }
}

Model._name = function(name) {
  return this.modelName() + '.' + name
}

/**
   Load an object by id or send an error if object isn't found.
   If you prefer to receive null for missed objects, use findOne({id: id})
   instead.

   @param {(string|object)} id An object id or dictionary lookup
*/
Model.get = function(where, opts, done) {
  var Klass = this
  if (typeof where === 'string') where = {id: where}
  if (!done) {
    done = opts
    opts = {}
  }
  debug(Klass._name('get'), where, opts)
  tflow([
    function() {
      Klass.findOne(where, opts, this)
    },
    function(model) {
      if (!model) return this.fail(
        404, Klass.modelName() + ' ' + (where.id || '') + ' isn\'t found.')
      else this.next(model)
    }
  ], done)
}

Model.findOne = function(where, opts, done) {
  var Klass = this
  if (typeof where === 'string') where = {id: where}
  if (!done) {
    done = opts
    opts = {}
  }
  debug(Klass._name('findOne'), where, opts)
  var q = Klass.table().where(where)
  if (opts.select) q = q.select(opts.select)
  else if (Klass.detailFields) q = q.select(Klass.detailFields)
  debug('SQL', q.toString())
  q.first().asCallback(modelize(Klass, done))
}

Model.find = function(q, done) {
  var Klass = this
  debug(Klass._name('find'), q, Klass.listFields)
  var query = Klass.table(q.parent)
    .select(q.select || Klass.listFields || '*')
  if (q.where) query = query.where(q.where)
  else if (q.ids) query = query.whereIn('id', q.ids)
  
  if (q.limit !== 0) query = query.limit(q.limit || 10)
  if (q.orderBy) query = query.orderBy.apply(query, q.orderBy)
  debug('SQL', query.toString())
  return query.asCallback(q.modelize ? modelize(Klass, done): done)
}


/**
   Insert data and return new record id. If there is no id generate an EDID.
*/
Model.create = function(data, parent, done) {
  if (!done && typeof parent === 'function') {
    done = parent
    parent = undefined
  }
  debug(this._name('create'), parent, data)
  var Klass = this
  tflow([
    function() {
      if (data.id) this.next(data.id)
      else Klass.edid.generate({parent: parent}, this)
    },
    function(id) {
      var rec = (id === data.id ? data : _.assign({id: id}, data))
      var q = Klass.table(id).insert(Klass._transform(rec), 'id')
      debug('SQL', q.toString())
      q.asCallback(this)
    },
    function(resIds) {
      this.next(resIds[0])
    }
  ], done);
}

Model.update = function(id, data, done) {
  debug(this._name('update'), data, 'table', this.table)
  var Klass = this
  tflow([
    function() {
      var q = Klass.table(data.id).where({id: id}).update(Klass._transform(data), 'id')
      console.log('Query', q.toString())
      debug(q.toString())
      q.asCallback(this)
    },
    function(resIds) {
      this.next(resIds[0])
    }
  ], done);
}

Model.getOrCreate = function(query, data, parent, done) {
  var Klass = this
  debug(this._name('getOrCreate'), query, parent)
  if (!done) {
    done = parent
    parent = null
  }
  var flow = tflow([
    () => Klass.findOne(query, flow),
    (obj) => {
      if (obj) return flow.complete(obj)
      Klass.create(Object.assign({}, query, data), parent, flow)
    },
    (id) => Klass.get(id, flow)
  ], done);
}

Model.remove = function(where, done) {
  debug(this._name('remove'), where)
  if (typeof where === 'string') where = {id: where}
  var Klass = this
  tflow([
    function() {
      Klass.table(where.id).where(where).del().asCallback(this)
    },
    function(count) {
      this.next({count: count})
    }
  ], done);
}

/**
   Stringify all objects as JSON fields.
*/
Model._transform = function(data) {
  return _.mapValues(data, function(value) {
    return (value !== null && typeof value === 'object'? JSON.stringify(value) : value)
  })
}

Model.validate = function(data, schema, done) {
  var errors = []
  //debug('validate', schema)
  Object.keys(data).forEach(function(key) {
    var value = data[key]
    var spec = schema[key] || {}
    //debug('key', key, 'value', value)
    Object.keys(spec).forEach(function(check) {
      if (check === 'optional' || check === 'errorMessage') return
      if (value === '' && spec.optional) return
      var args = [value].concat(spec[check].options || [])
      //debug('--check', check, args)
      if (!validator[check].apply(validator, args)) {
        errors.push({
          param: key,
          msg: spec[check].errorMessage || spec.errorMessage || 'Bad input: ' + key
        })
      }
    })
  })

  if (errors.length) done(errors)
  else done(null, data)
}

Model.pick = function(data, fields) {
  var res = {}
  for (var f of (fields || this.detailFields)) {
    if (data[f] !== undefined) res[f] = data[f]
  }
  return res
}

module.exports = Model
