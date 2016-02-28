/* jshint strict: true, undef: true */
/* globals is_something, has_property_of, to_string */


function length_of(num) {
  "use strict";

  return function (v) {
    if (!is_something(v) && has_property_of('length', 'number')(v))
      throw new Error('invalid value for length_of: ' + to_string(num));
    return v.length === num;
  };
}
