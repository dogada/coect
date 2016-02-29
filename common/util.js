exports.truncateUrl = function (url, limit) {
  limit = limit || 30
  url = url.replace(/http[s]?:\/\/(www\.)?/i, '')
  if (url.length <= limit) return url
  var segment = Math.floor(limit / 2) - 1
  return url.slice(0, segment) + '..' + url.slice(url.length - segment) 
}
