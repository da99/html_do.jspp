/* jshint strict: true, undef: true */
/* globals set_function_string_name */


function has_property_of(name, type) {
  "use strict";

  var f = function has_property_of(o) {
    return typeof o[name] === type;
  };

  return set_function_string_name(f, arguments);
}
