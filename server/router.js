'use strict'

exports.view = function(handler) {
  return function(req, res, next) {
    handler(req, res, function(err, data) {
      if (err) return next(err, req, res)
      if (data !== null && data !== undefined) return res.json(data)
      // if both error and data are null, then response already processed by handler
    })
  }
}

exports.routeAPI = function(router, endpoints) {
  for (let endpoint of endpoints) {
    let route = router.route(endpoint.path)
    for (let method of ['get', 'post', 'put', 'delete', 'head']) {
      if (endpoint[method]) route[method](exports.view(endpoint[method]))
    }
  }
  return router
}
