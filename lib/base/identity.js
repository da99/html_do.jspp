/* jshint strict: true, undef: true */

function identity(x) {
  "use strict";

  if (arguments.length !== 1)
    throw new Error("arguments.length !== 0");
  return x;
}
