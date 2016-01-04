exports.assign = function() {
  return Object.assign ?
    Object.assign.apply(Object, arguments) :
    jQuery.extend.apply(jQuery, arguments)
}
