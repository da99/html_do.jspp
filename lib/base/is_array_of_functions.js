/* jshint strict: true, undef: true */
/* globals spec, _, length_gt */


spec(is_array_of_functions, [[function () {}]], true);
spec(is_array_of_functions, [[]], false);
spec(is_array_of_functions, [[1]], false);
spec(is_array_of_functions, [1], false);

exports.is_array_of_functions = is_array_of_functions;
function is_array_of_functions(a) {
  "use strict";

  return _.isArray(a) && length_gt(a) > 0 && _.all(a, _.isFunction);
} // === func
