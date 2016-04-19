/* jshint strict: true, undef: true */
/* globals exports */


exports.is_function = is_function;
function is_function(v) {
  if (arguments.length !== 1)
    throw new Error("Invalid: arguments.length must === 1");
  return typeof v === 'function';
}
