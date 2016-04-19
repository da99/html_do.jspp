/* jshint strict: true, undef: true */
/* globals set_function_string_name */
/* globals exports */


exports.has_own_property = has_own_property;
function has_own_property(name) {

  var f = function __has_own_property(o) {
    return o.hasOwnProperty(name);
  };

  return set_function_string_name(f, arguments);
}
