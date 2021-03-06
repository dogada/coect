'use strict';

var debug = require('debug')('coect:json')
var misc = require('./misc')

var _ = require('lodash')

function parse(json, cb) {
  try {
    cb(null, JSON.parse(json));
  } catch (e) {
    cb(e);
  }
}

function stringify(data, cb) {
  try {
    cb(null, JSON.stringify(data));
  } catch (e) {
    cb(e);
  }
}


function errorCode(err) {
  if (err.status) {
    if (err.status.code) return err.status.code
    return err.status
  }
  return 500
}

function sendError(res, err) {
  console.log('json.sendError', err.status, err)
  res.status(errorCode(err))
  if (_.isArray(err)) res.json({errors: err})
  else if (err.status || err instanceof misc.HttpError) res.json({
    error: err.message || '' + err,
    code: err.status
  })
  else res.json({error: 'Oops... A server error occurred. Support team will be notified.'})
}

function sendJson(res, err, data) {
  if (err) return sendError(res, err);
  res.json(data || {});
}

function jsonResponse(res) {
  return function(err, data) {
    debug('jsonResponse', err, typeof data)
    sendJson(res, err, data)
  }
}

/**
   @param {string|[Object]} param Id of parameter or array of errors from
   express-validator
   @return List of errors.
*/
function errors(res, param, msg) {
  if (!msg) {
    msg = param
    param = null
  }
  var errs = msg
  if (typeof msg === 'string') {
    errs = [{param: param, msg: msg}]
  }
  console.error('json.errors', errs)
  res.status(400).json({errors: errs})
  return errs
}

/**
   Use `express-validator` to validate request against schema.
   Terminate invalid requests with 400 status code.
*/
function invalid(req, res, schema) {
  req.checkBody(schema)
  var errs = req.validationErrors()
  if (errs) return errors(res, errs)
}

module.exports = {
  parse: parse,
  stringify: stringify,
  sendError: sendError,
  response: jsonResponse,
  send: sendJson,
  invalid: invalid,
  errors: errors
};

