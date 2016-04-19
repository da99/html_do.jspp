/* jshint strict: true, undef: true */
/* globals spec */
/* globals exports */

spec(true,  function () { return is(5)(5); });
spec(false, function () { return is("a")("b"); });
exports.is = is;
function is(target) {

  return function (val) { return val === target; };
}
