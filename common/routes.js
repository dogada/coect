// return named route part for usage on both client and server side
exports.slug = function(param) {
  return '/:' + param + '([a-z]+[a-z0-9-]{2,})'
}
