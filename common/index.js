//defaut epoch for all EDID ids used by Coect apps 
exports.EPOCH = 1451606400000 //new Date("2016-01-01").getTime()

exports.bool = (value => value !== 'off' && value !== 'no' && value !== '0' && !!value)

exports.util = require('./util')

exports.object = require('./object')
exports.date = require('./date')
exports.Access = require('./access')
exports.orm = require('./orm')
exports.routes = require('./routes')
