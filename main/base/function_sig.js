/* jshint strict: true, undef: true */
/* globals _, to_string, function_to_name */


function function_sig(f, args) {
  "use strict";

  return function_to_name(f) + '(' + _.map(args, to_string).join(',')  + ')';
}
