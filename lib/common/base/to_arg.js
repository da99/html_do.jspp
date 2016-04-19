/* jshint strict: true, undef: true */
/* globals exports */

exports.to_arg = to_arg;
function to_arg(val) {
  return function (f) { return f(val); };
}
