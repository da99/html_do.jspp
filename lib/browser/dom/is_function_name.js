/* jshint strict: true, undef: true */
/* globals spec, is_string, window, is_function */
/* globals exports */

exports.is_function_name = is_function_name;

spec(is_function_name, ['is_function'], true);
spec(is_function_name, ['none none'], false);
spec(is_function_name, [is_function_name], false);

function is_function_name(v) {

  if (!is_string(v))
    return false;

  return is_function(exports[v]);
}
