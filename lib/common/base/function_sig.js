/* jshint strict: true, undef: true */
/* globals _, to_string, function_to_name */
/* globals exports */


exports.function_sig = function_sig;
function function_sig(f, args) {

  return function_to_name(f) + '(' + _.map(args, to_string).join(',')  + ')';
}
