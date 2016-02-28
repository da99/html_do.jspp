/* jshint strict: true, undef: true */
/* globals function_to_name, _, to_string */


function to_function_string(f, args) {
  "use strict";

  return function_to_name(f) + '(' + _.map(args, to_string).join(', ') + ')';
}
