/* jshint strict: true, undef: true */

exports.identity = identity;
function identity(x) {
  "use strict";

  if (arguments.length !== 1)
    throw new Error("arguments.length !== 0");
  return x;
}
