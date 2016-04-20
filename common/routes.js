// return named route part for usage on both client and server side
exports.slug = function(param) {
  return '/:' + param + '([a-z]+[a-z0-9-]{2,})'
}

exports.parseQuery = function (query) {
  var search = /([^&=]+)=?([^&]*)/g,
  decode = (s) => decodeURIComponent(s.replace (/\+/g, ' ')),
  res = {}, match

  while ((match = search.exec(query))) res[decode(match[1])] = decode (match[2])
  return res
}
