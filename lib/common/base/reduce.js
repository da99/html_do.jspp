/* jshint strict: true, undef: true */
/* globals _ */
/* globals exports */


exports.reduce = reduce;
function reduce(value, _functions) {

  var funcs = _.toArray(arguments);
  var v     = funcs.shift();
  return _.reduce(funcs, function (acc, f) { return f(acc); }, v);
}
