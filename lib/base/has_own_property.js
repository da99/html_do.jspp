/* jshint strict: true, undef: true */
/* globals set_function_string_name */


function has_own_property(name) {
  "use strict";

  var f = function __has_own_property(o) {
    return o.hasOwnProperty(name);
  };

  return set_function_string_name(f, arguments);
}
