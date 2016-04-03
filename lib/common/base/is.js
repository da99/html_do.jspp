/* jshint strict: true, undef: true */
/* globals spec */
/* globals exports */

spec(true,  function () { "use strict"; return is(5)(5); });
spec(false, function () { "use strict"; return is("a")("b"); });
exports.is = is;
function is(target) {
  "use strict";

  return function (val) { return val === target; };
}
