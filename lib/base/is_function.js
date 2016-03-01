/* jshint strict: true, undef: true */


exports.is_function = is_function;
function is_function(v) {
  "use strict";

  if (arguments.length !== 1)
    throw new Error("Invalid: arguments.length must === 1");
  return typeof v === 'function';
}
