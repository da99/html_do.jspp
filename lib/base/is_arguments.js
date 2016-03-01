/* jshint strict: true, undef: true */
/* globals spec, return_arguments, is_something, or, is, is_positive */
/* globals exports */

spec(is_arguments, [return_arguments()], true);
spec(is_arguments, [[]], false);

exports.is_arguments = is_arguments;
function is_arguments(v) {
  "use strict";

  return is_something(v) && v.constructor === arguments.constructor;
}
