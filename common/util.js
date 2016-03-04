'use strict';

exports.truncateUrl = function (url, limit) {
  limit = limit || 30
  url = url.replace(/http[s]?:\/\/(www\.)?/i, '')
  if (url.length <= limit) return url
  var segment = Math.floor(limit / 2) - 1
  return url.slice(0, segment) + '..' + url.slice(url.length - segment) 
}

exports.truncate = function(str, maxLen, minLen) {
  var res = str.trim().slice(0, maxLen), lastSpace = res.lastIndexOf(' ')
  for (let sep of ['.', '?', '!', ';', ',', ' ']) {
    let i = res.lastIndexOf(sep)
    if (i > (minLen || maxLen/3)) {
      res = res.slice(0, i)
      break
    }
  }
  res = res.trim()
  if (res.length < str.length) res += '\u2026'
  return res
}

