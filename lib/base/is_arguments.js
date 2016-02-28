/* jshint strict: true, undef: true */
/* globals spec, return_arguments, is_something, or, is, is_positive */

spec(is_arguments, [return_arguments()], true);
spec(is_arguments, [[]], false);

function is_arguments(v) {
  "use strict";

  return is_something(v) && or(is(0), is_positive)(v.length) && v.hasOwnProperty('callee');
}
