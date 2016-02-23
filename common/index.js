//defaut epoch for all EDID ids used by Coect apps 
const EPOCH = 1451606400000 //new Date("2016-01-01").getTime()

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const MONTH = 31 * DAY
const YEAR = 365 * DAY

function dateDiff(date, from) {
  if (!(date instanceof Date)) date = new Date(date)
  var ms = Math.abs(date - (from || new Date()))
  if (ms >= YEAR) return Math.floor(ms / YEAR) + 'Y'
  if (ms >= MONTH) return Math.floor(ms / MONTH) + 'M'
  if (ms >= DAY) return Math.floor(ms / DAY) + 'd'
  if (ms >= HOUR) return Math.floor(ms / HOUR) + 'h'
  if (ms >= MINUTE) return Math.floor(ms / MINUTE) + 'm'
  return Math.floor(ms / SECOND) + 's'
}

module.exports = {
  EPOCH,
  dateDiff
}
