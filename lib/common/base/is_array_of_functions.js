/* jshint strict: true, undef: true */
/* globals spec, _, length_gt */
/* globals exports, log */


spec(is_array_of_functions, [[function () {}]], true);
spec(is_array_of_functions, [[]], false);
spec(is_array_of_functions, [[1]], false);
spec(is_array_of_functions, [1], false);

exports.is_array_of_functions = is_array_of_functions;
function is_array_of_functions(a) {

  return _.isArray(a) && length_gt(0)(a) > 0 && _.every(a, _.isFunction);
} // === func
