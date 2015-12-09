var debug = require('debug')('coect:orm')
var _ = require('lodash')
var tflow = require('tflow')
var validator = require('validator')

var util = require('util')



function Model() {
}

Model.modelName = function() {
  var ret = this.toString()
  return ret.slice('function '.length, ret.indexOf('('))
}

Model._name = function(name) {
  return this.modelName() + '.' + name
}

Model.extend = function(Constructor) {
  _.assign(Constructor, Model) // copy static methods
  util.inherits(Constructor, Model) // set Model.prototype and super_
  return Constructor
}


Model.prototype.save = function(parent, done) {
  if (!done) {
    done = parent
    parent = null
  }
  if (this.id) this.constructor.update(this.id, this, done)
  else this.constructor.create(this, done)
}

Model.prototype.toString = function() {
  return (typeof this.id !== 'undefined' ? '' + this.id : this.id)
}

function modelize(Klass, done) {
  return function(err, row) {
    if (err) return done(err)
    return done(null, row ? new Klass(row) : row)
  }
}


/**
   Load an object by id or send an error if object isn't found.
   If you prefer to receive null for missed objects, use findOne({id: id})
   instead.

   @param {(string|object)} id An object id or dictionary lookup
*/
Model.get = function(where, done) {
  var Klass = this
  if (typeof where === 'string') where = {id: where}
  debug(Klass._name('get'), where)
  tflow([
    function() {
      Klass.table(where.id).where(where).first().asCallback(this)
    },
    function(row) {
      if (!row) return this.fail(404, 'Requested ' + Klass.modelName() + 'isn\'t found.')
      this.next(new Klass(row))
    },
  ], done);
}

Model.findById = function(id, done) {
  return this.findOne({id: id}, done)
}

Model.findOne = function(where, done) {
  var self = this
  debug(this._name('findOne'), where)
  var q = this.table().where(where).first()
  debug('SQL', q.toString())
  return q.asCallback(modelize(this, done))
}

Model.find = function(q, done) {
  debug(this._name('find'), q)
  var query = this.table(q.parent)
    .select(q.select || '*')
  if (q.where) query = query.where(q.where)
  else if (q.ids) query = query.whereIn('id', q.ids)
  
  if (q.limit !== 0) query = query.limit(q.limit || 10)
  if (q.orderBy) query = query.orderBy.apply(query, q.orderBy)

  return query.asCallback(q.modelize ? modelize(this, done): done)
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
  var self = this
  tflow([
    function() {
      if (data.id) this.next(data.id)
      else self.edid.generate({parent: parent}, this)
    },
    function(id) {
      var rec = (id === data.id ? data : objectAssign({id: id}, data))
      self.table(id).insert(self._transform(rec), 'id').asCallback(this)
    },
    function(resIds) {
      this.next(resIds[0])
    }
  ], done);
}

Model.update = function(id, data, done) {
  debug(this._name('update'), data, 'table', this.table)
  var self = this
  tflow([
    function() {
      var q = self.table(data.id).where({id: id}).update(self._transform(data), 'id')
      console.log('Query', q.toString())
      debug(q.toString())
      q.asCallback(this)
    },
    function(resIds) {
      this.next(resIds[0])
    }
  ], done);
}

Model.remove = function(id, done) {
  debug(this._name('remove'), id)
  var self = this
  tflow([
    function() {
      self.table(id).where({id: id}).del().asCallback(this)
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
  debug('validate', data)
  Object.keys(data).forEach(function(key) {
    var value = data[key]
    debug('key', key, 'value', value)
    Object.keys(schema[key] || {}).forEach(function(check) {
      if (check === 'optional') return
      var args = [value].concat(schema[key][check].options || [])
      debug('check', check, args)
      if (!validator[check].apply(validator, args)) {
        errors.push({
          param: key,
          msg: schema[key][check].errorMessage || schema[key].errorMessage || 'Bad input: ' + key,
          value: value
        })
      }
    })
  })

  if (errors.length) done(errors)
  else done()
}


/**
   Link model with shard mapping function. Shards can be spread across several
   database servers (and hense connections).
   @param {constructor} Model A model constructor.
   @param {function} A function that accept EDID id and return Knex instance to
   access database server that manages this id. 
*/
function link(Constructor, table) {
  Constructor.table = table
}

module.exports = {
  Model: Model,
  link: link
}
