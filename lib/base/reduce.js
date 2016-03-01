/* jshint strict: true, undef: true */
/* globals _ */


exports.reduce = reduce;
function reduce(value, _functions) {
  "use strict";

  var funcs = _.toArray(arguments);
  var v     = funcs.shift();
  return _.reduce(funcs, function (acc, f) { return f(acc); }, v);
}
