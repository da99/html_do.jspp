/* jshint strict: true, undef: true */
/* globals length */
/* globals exports */

spec(to_default, [1,undefined], 1);
spec(to_default, [2,null], 2);
spec(to_default, [3,[]], []);

exports.to_default = to_default;
function to_default(valid) {
  "use strict";

  if (length(arguments) === 2) {
    var v = arguments[1];
    if (v === null || v === undefined)
      return valid;
    return v;
  }

  return function (v) { return to_default(valid, v); };
}
