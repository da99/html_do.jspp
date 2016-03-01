/* jshint strict: true, undef: true */
/* globals function_to_name, _, to_string */


exports.to_function_string = to_function_string;
function to_function_string(f, args) {
  "use strict";

  return function_to_name(f) + '(' + _.map(args, to_string).join(', ') + ')';
}
